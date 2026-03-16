<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DiscountType;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backend/Admin/product/index');
    }

    // create
    public function create(): Response
    {
        return Inertia::render('backend/Admin/product/product-from', [
            // Only top-level categories (no parents), each carrying their children
            'categories'    => Category::whereDoesntHave('parents')
                ->with('children:id,title')
                ->get(['id', 'title']),
            'discountTypes' => DiscountType::options(),
        ]);
    }

    // edit — passes the full product so the form pre-fills from props (no fetch needed)
    public function edit(string $id): Response
    {
        $product = Product::with(['primaryImage', 'images', 'category'])->findOrFail($id);

        return Inertia::render('backend/Admin/product/product-from', [
            'product'       => $product,
            'categories'    => Category::whereDoesntHave('parents')
                ->with('children:id,title')
                ->get(['id', 'title']),
            'discountTypes' => DiscountType::options(),
        ]);
    }
}
