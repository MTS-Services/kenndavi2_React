<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreUserOtpRequest;
use App\Http\Requests\Auth\VerifyUserOtpRequest;
use App\Models\User;
use App\Models\UserOtpChallenge;
use App\Notifications\UserOtpCodeNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserOtpAuthController extends Controller
{
    public function store(StoreUserOtpRequest $request): RedirectResponse
    {
        $email = Str::lower(trim($request->string('email')->toString()));

        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'first_name' => $this->deriveFirstName($email),
                'last_name' => 'User',
                'password' => Hash::make(Str::random(64)),
                'status' => 'active',
            ]
        );

        $challenge = $this->issueChallenge($user, $request);
        $challengeUrl = $this->signedChallengeUrl($challenge);

        $user->notify(new UserOtpCodeNotification(
            code: $challenge->getAttribute('plain_code'),
            challengeUrl: $challengeUrl,
            verifyUrl: $this->signedVerifyUrl($challenge),
            expiresAt: $challenge->expires_at,
        ));

        return redirect()->to($challengeUrl)->with('status', 'We sent a one-time code to your email address.');
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

        if (! Hash::check($request->string('code')->toString(), $otp->code_hash)) {
            $otp->increment('attempts');

            return back()->withErrors([
                'code' => 'The verification code is invalid.',
            ])->withInput();
        }

        $otp->forceFill([
            'consumed_at' => now(),
        ])->save();

        $otp->user->forceFill([
            'email_verified_at' => $otp->user->email_verified_at ?? now(),
        ])->save();

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

        $challenge = $this->issueChallenge($user, $request);
        $challengeUrl = $this->signedChallengeUrl($challenge);

        $user->notify(new UserOtpCodeNotification(
            code: $challenge->getAttribute('plain_code'),
            challengeUrl: $challengeUrl,
            verifyUrl: $this->signedVerifyUrl($challenge),
            expiresAt: $challenge->expires_at,
        ));

        return redirect()->to($challengeUrl)->with('status', 'A fresh one-time code has been sent to your email address.');
    }

    private function issueChallenge(User $user, Request $request): UserOtpChallenge
    {
        UserOtpChallenge::query()
            ->where('user_id', $user->id)
            ->whereNull('consumed_at')
            ->delete();

        $code = (string) random_int(100000, 999999);

        $challenge = $user->otpChallenges()->create([
            'challenge_token' => (string) Str::uuid(),
            'code_hash' => Hash::make($code),
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

        if (! $otp || $otp->expires_at->isPast()) {
            return null;
        }

        return $otp;
    }

    private function findChallenge(string $challenge): ?UserOtpChallenge
    {
        return UserOtpChallenge::query()
            ->with('user')
            ->whereNull('consumed_at')
            ->where('challenge_token', $challenge)
            ->first();
    }

    private function signedChallengeUrl(UserOtpChallenge $challenge): string
    {
        return URL::temporarySignedRoute('user.otp.challenge', now()->addMinutes(10), [
            'challenge' => $challenge->challenge_token,
        ]);
    }

    private function signedVerifyUrl(UserOtpChallenge $challenge): string
    {
        return URL::temporarySignedRoute('user.otp.verify', now()->addMinutes(10), [
            'challenge' => $challenge->challenge_token,
        ]);
    }

    private function signedResendUrl(UserOtpChallenge $challenge): string
    {
        return URL::temporarySignedRoute('user.otp.resend', now()->addMinutes(10), [
            'challenge' => $challenge->challenge_token,
        ]);
    }

    private function deriveFirstName(string $email): string
    {
        $localPart = Str::before($email, '@');
        $localPart = preg_replace('/[^a-zA-Z0-9]+/', ' ', $localPart) ?: 'User';

        return Str::of(trim($localPart))->headline()->toString() ?: 'User';
    }

}
