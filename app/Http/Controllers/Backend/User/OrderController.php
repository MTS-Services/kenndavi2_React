<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function cart(): Response
    {
        return Inertia::render('frontend/products/cart');
    }
}
