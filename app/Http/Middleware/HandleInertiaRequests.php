<?php

namespace App\Http\Middleware;

use App\Support\FrontendNavigation;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Laravel\Fortify\Features;

class HandleInertiaRequests extends Middleware
{
    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'toast' => fn (): mixed => $request->session()->get('toast'),
            ],
            'name' => config('app.name'),
            'frontendNav' => FrontendNavigation::build(),
            'auth' => [
                'user' => $request->user(guard: 'web'),
                'admin' => $request->user(guard: 'admin'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'features' => [
                // 'canRegister' => Features::enabled(Features::registration()),
                // 'canResetPassword' => Features::enabled(Features::resetPasswords()),
                // 'canVerifyEmail' => Features::enabled(Features::emailVerification()),
                // 'canUseTwoFactorAuthentication' => Features::enabled(Features::twoFactorAuthentication()),
                'canRegister' => false,
                'canResetPassword' => false,
                'canVerifyEmail' => false,
                'canUseTwoFactorAuthentication' => false,
            ],
        ];
    }
}
