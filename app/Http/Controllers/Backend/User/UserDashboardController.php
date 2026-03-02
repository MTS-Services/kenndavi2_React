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
    
    public function OrderManagement(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.OrderManagement');
        }

        return Inertia::render('backend/User/OrderManagement');
    }

    public function DashboarOrdersdetails(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.DashboarOrdersdetails');
        }

        return Inertia::render('backend/User/DashboarOrdersdetails');
    }

    public function DashboarProduct(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.DashboarProduct');
        }

        return Inertia::render('backend/User/DashboarProduct');
    }

    public function DashboarOrdersAdd(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.DashboarOrdersAdd');
        }

        return Inertia::render('backend/User/DashboarOrdersAdd');
    }
    
    public function DashboarCustomer(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.DashboarCustomer');
        }

        return Inertia::render('backend/User/DashboarCustomer');
    }

    public function UserDashboard(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->is_admin) {
            return redirect()->route('admin.UserDashboard');
        }

        return Inertia::render('backend/User/UserDashboard');
    }
}
