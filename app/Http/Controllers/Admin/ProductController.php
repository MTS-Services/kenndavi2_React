<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DiscountType;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backend/Admin/product/index');
    }

    public function create(): Response
    {
        return Inertia::render('backend/Admin/product/product-from', [
            'categories'    => Category::whereDoesntHave('parents')
                ->with('children:id,title')
                ->get(['id', 'title']),
            'discountTypes' => DiscountType::options(),
        ]);
    }

    public function edit(Product $product): Response
    {
        // Eager-load everything the form needs so no client-side fetch is required
        $product->load([
            'images',
            'variants.color:id,name,hex',   // colour name + hex for the colour input
            'variants.size:id,name',         // size label
        ]);

        // Resolve subcategory: if the product's category has a parent, it IS a subcategory
        $categoryId    = null;
        $subcategoryId = null;

        if ($product->category_id) {
            $category = Category::with('parents:id,title')->find($product->category_id);

            if ($category?->parents->isNotEmpty()) {
                // product is stored against a subcategory
                $subcategoryId = $product->category_id;
                $categoryId    = $category->parents->first()->id;
            } else {
                // product is stored against a top-level category
                $categoryId = $product->category_id;
            }
        }

        return Inertia::render('backend/Admin/product/product-from', [
            'product'             => array_merge($product->toArray(), [
                'resolved_category_id'    => $categoryId,
                'resolved_subcategory_id' => $subcategoryId,
            ]),
            'categories'    => Category::whereDoesntHave('parents')
                ->with('children:id,title')
                ->get(['id', 'title']),
            'discountTypes' => DiscountType::options(),
        ]);
    }
}
