<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function shipping(): Response
    {
        return Inertia::render('backend/User/order-management/shipping');
    }
}
