<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form (email entry).
     */
    public function showLogin(): \Inertia\Response
    {
        return Inertia::render('frontend/User/userlogin');
    }

    /**
     * Handle sending the verification code.
     */
    public function sendCode(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Rate limiting - max 5 requests per minute
        $key = 'send-code:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'email' => 'Too many attempts. Please try again in ' . ceil($seconds / 60) . ' minute(s).',
            ]);
        }

        // Find or create the user silently
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            $name = Str::before($request->email, '@') ?: $request->email;

            $user = User::create([
                'name' => $name,
                'email' => $request->email,
                // Random password since login is via OTP, not password
                'password' => Hash::make(Str::random(40)),
            ]);
        }

        // Generate a 6-digit code
        $code = rand(100000, 999999);

        session(['verification_code' => $code, 'verification_email' => $request->email]);

        try {
            Mail::raw("Your sign-in verification code is: $code\n\nThis code expires in 10 minutes.", function ($message) use ($request) {
                $message->to($request->email)->subject('Your verification code');
            });
        } catch (\Throwable $e) {
            \Log::warning("Could not send OTP email: {$e->getMessage()}");
        }
        \Log::info("Verification code for {$request->email}: $code");

        // Increment rate limiter
        RateLimiter::hit($key, 60);

        // Redirect to verify page with email
        return redirect()->route('login.verify', ['email' => $request->email]);
    }

    /**
     * Show the verification code entry form.
     */
    public function showVerify(Request $request): \Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        $email = $request->query('email') ?? session('verification_email');

        if (! $email) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please enter your email first.',
            ]);
        }

        return Inertia::render('frontend/User/entercode', [
            'email' => $email,
        ]);
    }

    /**
     * Verify the code and log the user in.
     */
    public function verifyCode(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
        ]);

        // Rate limiting
        $key = 'verify-code:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'code' => 'Too many attempts. Please try again in ' . ceil($seconds / 60) . ' minute(s).',
            ])->withInput($request->except('code'));
        }

        // Verify the code
        $storedCode = session('verification_code');
        $storedEmail = session('verification_email');

        if ($storedCode != $request->code || $storedEmail != $request->email) {
            RateLimiter::hit($key, 60);
            return back()->withErrors([
                'code' => 'Invalid verification code.',
            ])->withInput($request->except('code'));
        }

        // Code is valid, find or create the user and log them in
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            $name = Str::before($request->email, '@') ?: $request->email;

            $user = User::create([
                'name' => $name,
                'email' => $request->email,
                'password' => Hash::make(Str::random(40)),
            ]);
        }

        // Clear the verification code from session
        session()->forget(['verification_code', 'verification_email']);

        // Log in the user (web guard)
        Auth::guard('web')->login($user);

        // Regenerate session
        $request->session()->regenerate();

        // Always redirect to user dashboard (never to admin intended URL)
        return redirect()->route('dashboard')->with('success', 'Login successful!');
    }
}
