<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('backend/Admin/AdminDashboard');
    }

    public function OrderManagement(Request $request): Response
    {
        return Inertia::render('backend/Admin/OrderManagement');
    }

    public function DashboarOrdersdetails(Request $request): Response
    {
        return Inertia::render('backend/Admin/DashboarOrdersdetails');
    }

    public function DashboarProduct(Request $request): Response
    {
        return Inertia::render('backend/Admin/DashboarProduct');
    }

    public function DashboarOrdersAdd(Request $request): Response
    {
        return Inertia::render('backend/Admin/DashboarOrdersAdd');
    }

    public function DashboarCustomer(Request $request): Response
    {
        return Inertia::render('backend/Admin/DashboarCustomer');
    }
}
