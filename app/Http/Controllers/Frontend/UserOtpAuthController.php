<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreUserOtpRequest;
use App\Http\Requests\Auth\VerifyUserOtpRequest;
use App\Jobs\Auth\SendUserOtpMailJob;
use App\Models\User;
use App\Models\UserOtpChallenge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserOtpAuthController extends Controller
{
    /**
     * Maximum consecutive wrong-code attempts before the challenge is locked.
     * The user must request a fresh OTP after hitting this ceiling.
     */
    private const MAX_ATTEMPTS = 5;

    // -------------------------------------------------------------------------
    // Public actions
    // -------------------------------------------------------------------------

    public function store(StoreUserOtpRequest $request): RedirectResponse
    {
        $email = Str::lower(trim($request->string('email')->toString()));

        [$user, $challenge] = DB::transaction(function () use ($email, $request) {
            $user = User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'first_name' => $this->deriveFirstName($email),
                    'last_name' => '',
                    'password' => Hash::make(Str::random(64)),
                    'status' => 'active',
                ],
            );

            return [$user, $this->issueChallenge($user, $request)];
        });

        // Dispatch the mail job to the queue — the HTTP response returns
        // immediately. The user lands on the challenge page before the queue
        // worker even starts the SMTP handshake.
        $this->dispatchOtpMail($user, $challenge);

        return redirect()
            ->to($this->signedChallengeUrl($challenge))
            ->with('status', 'We sent a one-time code to your email address.');
    }

    public function challenge(Request $request, string $challenge): Response|RedirectResponse
    {
        $otp = $this->findChallenge($challenge);

        if (! $otp) {
            return redirect()->route('login')->withErrors([
                'email' => 'This sign-in link is invalid or has expired. Please request a new code.',
            ]);
        }

        return Inertia::render('auth/two-factor-challenge', [
            'mode' => 'otp',
            'email' => $otp->user->email,
            'status' => $request->session()->get('status'),
            'expiresAt' => $otp->expires_at?->toIso8601String(),
            'isExpired' => $otp->expires_at?->isPast() ?? true,
            'verifyUrl' => $this->signedVerifyUrl($otp),
            'resendUrl' => $this->signedResendUrl($otp),
        ]);
    }

    public function verify(VerifyUserOtpRequest $request, string $challenge): RedirectResponse
    {
        $otp = $this->resolveChallenge($challenge);

        if (! $otp) {
            return redirect()->route('login')->withErrors([
                'email' => 'This sign-in link is invalid or has expired. Please request a new code.',
            ]);
        }

        // Enforce per-challenge attempt ceiling before doing any hashing work.
        if ($otp->attempts >= self::MAX_ATTEMPTS) {
            return redirect()->route('login')->withErrors([
                'email' => 'Too many incorrect attempts. Please request a new code.',
            ]);
        }

        if (! $this->verifyCode($request->string('code')->toString(), $otp->code_hash)) {
            $otp->increment('attempts');

            $remaining = self::MAX_ATTEMPTS - $otp->attempts;

            return back()->withErrors([
                'code' => $remaining > 0
                    ? "The verification code is invalid. {$remaining} attempt(s) remaining."
                    : 'Too many incorrect attempts. Please request a new code.',
            ])->withInput();
        }

        DB::transaction(function () use ($otp) {
            $otp->forceFill(['consumed_at' => now()])->save();

            $otp->user->forceFill([
                'email_verified_at' => $otp->user->email_verified_at ?? now(),
            ])->save();
        });

        Auth::guard('web')->login($otp->user);
        $request->session()->regenerate();
        $request->session()->regenerateToken();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function resend(Request $request, string $challenge): RedirectResponse
    {
        $otp = $this->findChallenge($challenge);

        if (! $otp) {
            return redirect()->route('login')->withErrors([
                'email' => 'This sign-in link is invalid or has expired. Please request a new code.',
            ]);
        }

        $user = $otp->user;

        $newChallenge = DB::transaction(fn () => $this->issueChallenge($user, $request));

        $this->dispatchOtpMail($user, $newChallenge);

        return redirect()
            ->to($this->signedChallengeUrl($newChallenge))
            ->with('status', 'A fresh one-time code has been sent to your email address.');
    }

    // -------------------------------------------------------------------------
    // Mail dispatch
    // -------------------------------------------------------------------------

    /**
     * Push the OTP mail job onto the notifications queue.
     *
     * Centralised here so both store() and resend() stay clean and any future
     * change to dispatch strategy (delay, connection, chain) lives in one place.
     */
    private function dispatchOtpMail(User $user, UserOtpChallenge $challenge): void
    {
        SendUserOtpMailJob::dispatch(
            toEmail: $user->email,
            toName: $user->name,
            code: $challenge->getAttribute('plain_code'),
            challengeUrl: $this->signedChallengeUrl($challenge),
            verifyUrl: $this->signedVerifyUrl($challenge),
            expiresAt: $challenge->expires_at,
        );
    }

    // -------------------------------------------------------------------------
    // Challenge lifecycle
    // -------------------------------------------------------------------------

    /**
     * Invalidate any open challenges for this user and issue a fresh one.
     *
     * Uses HMAC-SHA256 instead of bcrypt for the code hash:
     *   - bcrypt cost 12 ≈ 200–400 ms per call (correct for long-lived passwords)
     *   - HMAC-SHA256 ≈ <1 ms (correct for a rate-limited, short-lived, capped OTP)
     */
    private function issueChallenge(User $user, Request $request): UserOtpChallenge
    {
        UserOtpChallenge::query()
            ->where('user_id', $user->id)
            ->whereNull('consumed_at')
            ->delete();

        $code = (string) random_int(100000, 999999);

        $challenge = $user->otpChallenges()->create([
            'challenge_token' => (string) Str::uuid(),
            'code_hash' => $this->hashCode($code),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(2),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $challenge->setAttribute('plain_code', $code);

        return $challenge;
    }

    private function resolveChallenge(string $challenge): ?UserOtpChallenge
    {
        $otp = $this->findChallenge($challenge);

        return ($otp && ! $otp->expires_at->isPast()) ? $otp : null;
    }

    private function findChallenge(string $challenge): ?UserOtpChallenge
    {
        return UserOtpChallenge::query()
            ->with('user')
            ->whereNull('consumed_at')
            ->where('challenge_token', $challenge)
            ->first();
    }

    // -------------------------------------------------------------------------
    // Hashing
    // -------------------------------------------------------------------------

    private function hashCode(string $code): string
    {
        return hash_hmac('sha256', $code, config('app.key'));
    }

    private function verifyCode(string $code, string $storedHash): bool
    {
        return hash_equals($storedHash, $this->hashCode($code));
    }

    // -------------------------------------------------------------------------
    // Signed URLs
    // -------------------------------------------------------------------------

    private function signedChallengeUrl(UserOtpChallenge $challenge): string
    {
        return URL::temporarySignedRoute(
            'user.otp.challenge',
            now()->addMinutes(10),
            ['challenge' => $challenge->challenge_token],
        );
    }

    private function signedVerifyUrl(UserOtpChallenge $challenge): string
    {
        return URL::temporarySignedRoute(
            'user.otp.verify',
            now()->addMinutes(10),
            ['challenge' => $challenge->challenge_token],
        );
    }

    private function signedResendUrl(UserOtpChallenge $challenge): string
    {
        return URL::temporarySignedRoute(
            'user.otp.resend',
            now()->addMinutes(10),
            ['challenge' => $challenge->challenge_token],
        );
    }

    // -------------------------------------------------------------------------
    // Utilities
    // -------------------------------------------------------------------------

    private function deriveFirstName(string $email): string
    {
        $localPart = Str::before($email, '@');
        $localPart = preg_replace('/[^a-zA-Z0-9]+/', ' ', $localPart) ?: 'User';

        return Str::of(trim($localPart))->headline()->toString() ?: 'User';
    }
}
