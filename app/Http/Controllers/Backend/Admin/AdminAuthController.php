<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Models\Admin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthController extends Controller
{
    /**
     * Show the admin login form (email + password) using the storefront layout.
     */
    public function create(): Response
    {
        return Inertia::render('auth/admin-login', [
            'status' => session('status'),
            'error' => session('error'),
        ]);
    }

    /**
     * Handle an admin login attempt using email and password.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    /**
     * Destroy an admin session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    /**
     * Show the admin forgot password form.
     */
    public function showForgot(): Response
    {
        return Inertia::render('auth/admin-forgot-password');
    }

    /**
     * Send the password reset verification code for admin.
     */
    public function sendCode(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Rate limiting - max 5 requests per minute
        $key = 'admin-password-reset-code:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return back()->withErrors([
                'email' => 'Too many attempts. Please try again in '.ceil($seconds / 60).' minute(s).',
            ]);
        }

        // Check if admin exists
        $admin = Admin::where('email', $request->email)->first();

        if (! $admin) {
            return redirect()->route('admin.password.verify', ['email' => $request->email])
                ->with('status', 'If an account exists with this email, you will receive a verification code.');
        }

        // Generate a 6-digit code
        $code = rand(100000, 999999);

        session([
            'admin_password_reset_code' => $code,
            'admin_password_reset_email' => $request->email,
            'admin_password_reset_code_expires' => now()->addMinutes(10)->timestamp,
        ]);

        try {
            Mail::raw("Your admin password reset verification code is: $code\n\nThis code expires in 10 minutes.\n\nIf you didn't request a password reset, please ignore this email.", function ($message) use ($request) {
                $message->to($request->email)->subject('Admin Password Reset Verification Code');
            });
        } catch (\Throwable $e) {
            \Log::warning("Could not send admin password reset email: {$e->getMessage()}");
        }

        \Log::info("Admin password reset code for {$request->email}: $code");

        RateLimiter::hit($key, 60);

        return redirect()->route('admin.password.verify', ['email' => $request->email])
            ->with('status', 'If an account exists with this email, you will receive a verification code.');
    }

    /**
     * Show the verification code entry form for admin.
     */
    public function showVerify(Request $request): RedirectResponse|Response
    {
        $email = $request->query('email') ?? session('admin_password_reset_email');

        if (! $email) {
            return redirect()->route('admin.password.request')->withErrors([
                'email' => 'Please enter your email first.',
            ]);
        }

        return Inertia::render('auth/admin-reset-password-code', [
            'email' => $email,
        ]);
    }

    /**
     * Verify the code and redirect to reset password form for admin.
     */
    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
        ]);

        $key = 'admin-verify-password-code:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return back()->withErrors([
                'code' => 'Too many attempts. Please try again in '.ceil($seconds / 60).' minute(s).',
            ])->withInput($request->except('code'));
        }

        $expiresAt = session('admin_password_reset_code_expires');
        if (! $expiresAt || now()->timestamp > $expiresAt) {
            RateLimiter::hit($key, 60);

            return back()->withErrors([
                'code' => 'The verification code has expired. Please request a new one.',
            ])->withInput($request->except('code'));
        }

        $storedCode = session('admin_password_reset_code');
        $storedEmail = session('admin_password_reset_email');

        if ($storedCode != $request->code || $storedEmail != $request->email) {
            RateLimiter::hit($key, 60);

            return back()->withErrors([
                'code' => 'Invalid verification code.',
            ])->withInput($request->except('code'));
        }

        $token = Str::random(64);

        session([
            'admin_password_reset_token' => $token,
            'admin_password_reset_verified' => true,
        ]);

        return redirect()->route('admin.password.reset', ['token' => $token, 'email' => $request->email]);
    }

    /**
     * Show the reset password form for admin.
     */
    public function showReset(Request $request): RedirectResponse|Response
    {
        $token = $request->query('token');
        $email = $request->query('email');

        if (! $token || ! $email || session('admin_password_reset_token') !== $token || ! session('admin_password_reset_verified')) {
            return redirect()->route('admin.password.request')->withErrors([
                'email' => 'Invalid password reset request. Please start again.',
            ]);
        }

        return Inertia::render('auth/admin-reset-password', [
            'email' => $email,
            'token' => $token,
        ]);
    }

    /**
     * Reset the admin's password.
     */
    public function reset(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        if (session('admin_password_reset_token') !== $request->token ||
            session('admin_password_reset_email') !== $request->email ||
            ! session('admin_password_reset_verified')) {
            return back()->withErrors([
                'email' => 'Invalid password reset request. Please start again.',
            ]);
        }

        $admin = Admin::where('email', $request->email)->first();

        if (! $admin) {
            return back()->withErrors([
                'email' => 'User not found.',
            ]);
        }

        $admin->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        session()->forget([
            'admin_password_reset_code',
            'admin_password_reset_email',
            'admin_password_reset_code_expires',
            'admin_password_reset_token',
            'admin_password_reset_verified',
        ]);

        return redirect()->route('admin.login')->with('status', 'Your password has been reset successfully. Please log in with your new password.');
    }

    /**
     * Resend the verification code for admin.
     */
    public function resendCode(Request $request): RedirectResponse
    {
        $email = $request->query('email') ?? session('admin_password_reset_email');

        if (! $email) {
            return redirect()->route('admin.password.request');
        }

        $key = 'admin-password-reset-code:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return back()->withErrors([
                'email' => 'Too many attempts. Please try again in '.ceil($seconds / 60).' minute(s).',
            ]);
        }

        $admin = Admin::where('email', $email)->first();

        if (! $admin) {
            return redirect()->route('admin.password.verify', ['email' => $email])
                ->with('status', 'If an account exists with this email, you will receive a verification code.');
        }

        $code = rand(100000, 999999);

        session([
            'admin_password_reset_code' => $code,
            'admin_password_reset_email' => $email,
            'admin_password_reset_code_expires' => now()->addMinutes(10)->timestamp,
        ]);

        try {
            Mail::raw("Your admin password reset verification code is: $code\n\nThis code expires in 10 minutes.\n\nIf you didn't request a password reset, please ignore this email.", function ($message) use ($email) {
                $message->to($email)->subject('Admin Password Reset Verification Code');
            });
        } catch (\Throwable $e) {
            \Log::warning("Could not send admin password reset email: {$e->getMessage()}");
        }

        \Log::info("Admin password reset code (resent) for $email: $code");

        RateLimiter::hit($key, 60);

        return redirect()->route('admin.password.verify', ['email' => $email])
            ->with('status', 'A new verification code has been sent to your email.');
    }
}
