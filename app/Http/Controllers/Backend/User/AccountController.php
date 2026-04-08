<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateUserAddressRequest;
use App\Http\Requests\Settings\UpdateUserProfileRequest;
use App\Http\Requests\Settings\UpdateUserSettingsRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(): Response
    {
        $user = request()->user();

        return Inertia::render('backend/user/profile', [
            'profile' => $this->profilePayload($user),
            'address' => $this->addressPayload($user),
        ]);
    }

    public function edit(): Response
    {
        $user = request()->user();

        return Inertia::render('backend/user/profile-form', [
            'profile' => $this->profilePayload($user),
        ]);
    }

    public function update(UpdateUserProfileRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return redirect()
            ->route('user.profile.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Profile updated successfully.',
            ]);
    }

    public function settings(): Response
    {
        return Inertia::render('backend/user/settings');
    }

    public function updateSettings(UpdateUserSettingsRequest $request): RedirectResponse
    {
        $action = $request->validated('action');

        if ($action === 'logout_current') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect('/')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'You have been signed out.',
                ]);
        }

        if (Schema::hasTable('sessions')) {
            DB::table('sessions')
                ->where('user_id', $request->user()->id)
                ->where('id', '!=', $request->session()->getId())
                ->delete();
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Signed out from all devices.',
            ]);
    }

    public function address(): Response
    {
        $user = request()->user();

        return Inertia::render('backend/user/address-form', [
            'address' => $this->addressPayload($user),
        ]);
    }

    public function updateAddress(UpdateUserAddressRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return redirect()
            ->route('user.profile.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Address updated successfully.',
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function profilePayload(User $user): array
    {
        return [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function addressPayload(User $user): array
    {
        return [
            'state' => $user->state,
            'city' => $user->city,
            'zip_code' => $user->zip_code,
            'address_line' => $user->address_line,
        ];
    }
}
