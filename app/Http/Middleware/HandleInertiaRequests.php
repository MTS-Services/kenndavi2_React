<?php

namespace App\Http\Middleware;

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
        $webUser = $request->user();
        $adminUser = auth('admin')->user();

        // For shared layout/UI: use web user when present, otherwise admin (so is_admin works for both)
        $userForDisplay = $webUser ?? $adminUser;
        $isAdmin = $adminUser !== null;

        $authUser = null;
        if ($userForDisplay) {
            $onlyKeys = array_intersect(
                ['id', 'email', 'name', 'phone_number', 'employee_code', 'avatar'],
                array_keys($userForDisplay->getAttributes())
            );
            $authUser = array_merge(
                $userForDisplay->only($onlyKeys),
                [
                    'name' => $this->displayName($userForDisplay),
                    'role' => $webUser?->role?->value ?? null,
                    'role_label' => $webUser?->role_label ?? ($isAdmin ? 'Admin' : 'User'),
                    'is_admin' => $isAdmin,
                    'can_manage_users' => $isAdmin,
                    'avatar_url' => method_exists($userForDisplay, 'getAvatarUrlAttribute') ? $userForDisplay->avatar_url : null,
                ]
            );
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $authUser,
                'admin' => $adminUser ? [
                    'id' => $adminUser->id,
                    'email' => $adminUser->email,
                    'name' => $adminUser->name,
                ] : null,
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

    private function displayName($user): string
    {
        return ! empty($user->name) ? $user->name : $user->email;
    }
}
