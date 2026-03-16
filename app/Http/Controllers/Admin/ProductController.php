<?php

namespace App\Http\Controllers\Admin;

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
            'categories' => Category::whereDoesntHave('parents')->get(['id', 'title']),
        ]);
    }

    // edit — passes the full product so the form pre-fills from props (no fetch needed)
    public function edit(string $id): Response
    {
        return Inertia::render('backend/Admin/product/product-from', [
            'product'    => Product::findOrFail($id),
            'categories' => Category::whereDoesntHave('parents')->get(['id', 'title']),
        ]);
    }
}
