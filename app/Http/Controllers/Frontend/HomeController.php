<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()->with('primaryImage')->featured()->take(4)->get();
        return Inertia::render(
            'frontend/home',
            [
                'products' => $products,
            ]
        );
    }
}
