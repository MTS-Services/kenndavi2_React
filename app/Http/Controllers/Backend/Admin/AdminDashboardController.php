<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
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
        $validTabs = ['pending', 'shipped', 'delivered', 'cancelled'];
        $initialTab = $request->query('tab');
        if (! in_array($initialTab, $validTabs, true)) {
            $initialTab = 'pending';
        }

        return Inertia::render('backend/Admin/OrderManagement', [
            'initialTab' => $initialTab,
        ]);
    }

    public function DashboarOrdersdetails(Request $request): Response
    {
        return Inertia::render('backend/Admin/Ordersdetails');
    }

    public function DashboarProduct(Request $request): Response
    {
        return Inertia::render('backend/Admin/Product');
    }

    public function DashboarOrdersAdd(Request $request): Response
    {
        return Inertia::render('backend/Admin/OrdersAdd');
    }

    public function DashboarCustomer(Request $request): Response
    {
        return Inertia::render('backend/Admin/Customer');
    }

    public function DashboarShipped(Request $request): RedirectResponse
    {
        return redirect()->route('admin.orders.index', ['tab' => 'shipped']);
    }

    public function DashboarDelivered(Request $request): RedirectResponse
    {
        return redirect()->route('admin.orders.index', ['tab' => 'delivered']);
    }

    public function DashboarCancelled(Request $request): RedirectResponse
    {
        return redirect()->route('admin.orders.index', ['tab' => 'cancelled']);
    }
}
