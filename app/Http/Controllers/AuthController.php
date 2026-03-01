<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use App\Models\User;

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
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        // Rate limiting - max 5 requests per minute
        $key = 'send-code:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'email' => 'Too many attempts. Please try again in ' . ceil($seconds / 60) . ' minute(s).',
            ]);
        }

        // Find the user
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'No user found with this email address.',
            ]);
        }

        // Generate a 6-digit code
        $code = rand(100000, 999999);

        // Store code in session (in production, use proper OTP storage with expiration)
        session(['verification_code' => $code, 'verification_email' => $request->email]);

        // In production, send the code via email
        // Mail::raw("Your verification code is: $code", function ($message) use ($request) {
        //     $message->to($request->email)->subject('Verification Code');
        // });

        // For development, log the code
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

        if (!$email) {
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

        // Code is valid, log the user in
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'code' => 'User not found.',
            ])->withInput($request->except('code'));
        }

        // Clear the verification code from session
        session()->forget(['verification_code', 'verification_email']);

        // Log in the user
        Auth::login($user);

        // Regenerate session
        $request->session()->regenerate();

        // Redirect to dashboard or home
        return redirect()->intended(route('home'))->with('success', 'Login successful!');
    }
}
