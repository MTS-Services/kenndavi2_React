<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ProductType;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $typeValue = $request->query('type', ProductType::MEN->value);

        // Fallback to MEN if an unrecognised type is passed
        $type = ProductType::tryFrom($typeValue) ?? ProductType::MEN;

        $products = Product::query()
            ->with('primaryImage')
            ->forType($type)
            ->featured()
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('frontend/home', [
            'products' => $products,
        ]);
    }
}
