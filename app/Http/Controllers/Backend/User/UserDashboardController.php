<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('backend/User/UserDashboard');
    }
}
