<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\ProductStatus;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('frontend/home');
    }

    public function men(): Response
    {
        return Inertia::render('frontend/men');
    }

    public function women(): Response
    {
        return Inertia::render('frontend/women');
    }

    public function accessories(): Response
    {
        return Inertia::render('frontend/accessories');
    }

    public function productdetails(): Response
    {
        return Inertia::render('frontend/productdetails');
    }

    public function aisuggestion(): Response
    {
        return Inertia::render('frontend/aisuggestion');
    }

    public function homeWomen(): Response
    {
        return Inertia::render('frontend/home-women');
    }

    public function cartpage(): Response
    {
        return Inertia::render('frontend/cartpage');
    }

    public function addToCart(): \Illuminate\Http\RedirectResponse
    {
        $cart = session()->get('cart', []);

        $cart[] = [
            'product_id' => request('product_id'),
            'quantity' => request('quantity'),
            'color' => request('color'),
            'size' => request('size'),
            'price' => request('price'),
        ];

        session()->put('cart', $cart);

        return to_route('cartpage');
    }

    public function userlogin(): Response
    {
        return Inertia::render('frontend/User/userlogin');
    }

    public function entercode(): Response
    {
        return Inertia::render('frontend/User/entercode');
    }

    public function productdetails2(): Response
    {
        return Inertia::render('frontend/productdetails2');
    }

    public function orderconfirmed(): Response
    {
        return Inertia::render('frontend/orderconfirmed');
    }

    public function hoodiesWomen(Request $request): Response
    {
        $productStatus = ProductStatus::ACTIVE->value;

        $selectedCategory = $request->query('category', 'all'); // parent slug
        $selectedSubcategory = $request->query('subcategory', 'all'); // child slug
        $page = max(1, (int) $request->query('page', 1));
        $perPage = 4;
        $offset = ($page - 1) * $perPage;

        $type = 'women';

        // Build parent category dropdown from category_relations:
        // - category_relations.category_id = parent
        // - category_relations.sub_category_id = child (subcategory)
        // Products store the "child" category id in products.category_id.

        $parents = DB::table('category_relations as cr')
            ->join('categories as parent', 'parent.id', '=', 'cr.category_id')
            ->join('categories as child', 'child.id', '=', 'cr.sub_category_id')
            ->join('products as p', 'p.category_id', '=', 'child.id')
            ->where('parent.status', 'active')
            ->where('child.status', 'active')
            ->where('p.type', $type)
            ->where('p.status', $productStatus)
            ->select('parent.id', 'parent.slug', 'parent.title', 'parent.sort_order')
            ->distinct()
            ->orderBy('parent.sort_order')
            ->get();

        $categories = $parents
            ->map(fn ($c) => ['value' => $c->slug, 'label' => $c->title])
            ->values()
            ->all();

        $validParentSlugs = $parents->pluck('slug')->all();
        if ($selectedCategory !== 'all' && ! in_array($selectedCategory, $validParentSlugs, true)) {
            $selectedCategory = 'all';
        }

        // Map: { [parentSlug]: [{ value: childSlug, label: childTitle }, ...] }
        $subRows = DB::table('category_relations as cr')
            ->join('categories as parent', 'parent.id', '=', 'cr.category_id')
            ->join('categories as child', 'child.id', '=', 'cr.sub_category_id')
            ->join('products as p', 'p.category_id', '=', 'child.id')
            ->where('parent.status', 'active')
            ->where('child.status', 'active')
            ->where('p.type', $type)
            ->where('p.status', $productStatus)
            ->select(
                'parent.slug as parent_slug',
                'parent.sort_order as parent_sort_order',
                'child.slug as sub_slug',
                'child.title as sub_title',
                'child.sort_order as sub_sort_order'
            )
            ->distinct()
            ->orderBy('parent_sort_order')
            ->orderBy('child.sort_order')
            ->get();

        $subcategories = [];
        foreach ($subRows as $row) {
            $subcategories[$row->parent_slug][] = [
                'value' => $row->sub_slug,
                'label' => $row->sub_title,
            ];
        }

        // If a subcategory is selected, ensure it's valid for the selected parent.
        // Otherwise, reset it to "all".
        if ($selectedSubcategory !== 'all') {
            $validChildSlugs = $selectedCategory === 'all'
                ? collect($subcategories)->flatten()->pluck('value')->all()
                : collect($subcategories[$selectedCategory] ?? [])->pluck('value')->all();

            if (! in_array($selectedSubcategory, $validChildSlugs, true)) {
                $selectedSubcategory = 'all';
            }
        }

        // Product listing (filtered by selected parent/subcategory).
        $productQuery = DB::table('products as p')
            ->leftJoin('product_images as pi_primary', function ($join) {
                $join->on('pi_primary.product_id', '=', 'p.id')->where('pi_primary.is_primary', 1);
            })
            ->leftJoin('product_images as pi_fallback', function ($join) {
                $join->on('pi_fallback.product_id', '=', 'p.id');
                $join->whereRaw(
                    'pi_fallback.sort_order = (select min(pi2.sort_order) from product_images pi2 where pi2.product_id = p.id)'
                );
            })
            ->select(
                'p.id',
                'p.title',
                'p.slug',
                'p.price',
                'p.discount',
                DB::raw('COALESCE(pi_primary.url, pi_fallback.url) as image_url'),
                'p.sort_order'
            )
            ->where('p.type', $type)
            ->where('p.status', $productStatus);

        if ($selectedSubcategory !== 'all') {
            $childId = Category::query()->where('slug', $selectedSubcategory)->value('id');
            if ($childId) {
                $productQuery->where('p.category_id', $childId);
            } else {
                // No matching category -> return empty list.
                $productQuery->whereRaw('1=0');
            }
        } elseif ($selectedCategory !== 'all') {
            $parentId = Category::query()->where('slug', $selectedCategory)->value('id');
            if ($parentId) {
                $childIds = DB::table('category_relations')
                    ->where('category_id', $parentId)
                    ->pluck('sub_category_id')
                    ->all();

                if (! empty($childIds)) {
                    $productQuery->whereIn('p.category_id', $childIds);
                } else {
                    $productQuery->whereRaw('1=0');
                }
            } else {
                $productQuery->whereRaw('1=0');
            }
        }

        $total = (clone $productQuery)->distinct()->count('p.id');
        $totalPages = (int) ceil($total / $perPage);

        $products = $productQuery
            ->orderBy('p.sort_order', 'desc')
            ->offset($offset)
            ->limit($perPage)
            ->get();

        return Inertia::render('frontend/hoodies-women', [
            'categories' => $categories,
            'subcategories' => $subcategories,
            'selectedCategory' => $selectedCategory,
            'selectedSubcategory' => $selectedSubcategory,
            'products' => $products,
            'currentPage' => $page,
            'perPage' => $perPage,
            'totalPages' => $totalPages,
        ]);
    }

    public function sweatsuitsMen(Request $request): Response
    {
        $productStatus = ProductStatus::ACTIVE->value;

        $selectedCategory = $request->query('category', 'all'); // parent slug
        $selectedSubcategory = $request->query('subcategory', 'all'); // child slug
        $page = max(1, (int) $request->query('page', 1));
        $perPage = 4;
        $offset = ($page - 1) * $perPage;

        $type = 'men';

        // Parent category dropdown based on category_relations + products.
        $parents = DB::table('category_relations as cr')
            ->join('categories as parent', 'parent.id', '=', 'cr.category_id')
            ->join('categories as child', 'child.id', '=', 'cr.sub_category_id')
            ->join('products as p', 'p.category_id', '=', 'child.id')
            ->where('parent.status', 'active')
            ->where('child.status', 'active')
            ->where('p.type', $type)
            ->where('p.status', $productStatus)
            ->select('parent.id', 'parent.slug', 'parent.title', 'parent.sort_order')
            ->distinct()
            ->orderBy('parent.sort_order')
            ->get();

        $categories = $parents
            ->map(fn ($c) => ['value' => $c->slug, 'label' => $c->title])
            ->values()
            ->all();

        $validParentSlugs = $parents->pluck('slug')->all();
        if ($selectedCategory !== 'all' && ! in_array($selectedCategory, $validParentSlugs, true)) {
            $selectedCategory = 'all';
        }

        // Subcategory map.
        $subRows = DB::table('category_relations as cr')
            ->join('categories as parent', 'parent.id', '=', 'cr.category_id')
            ->join('categories as child', 'child.id', '=', 'cr.sub_category_id')
            ->join('products as p', 'p.category_id', '=', 'child.id')
            ->where('parent.status', 'active')
            ->where('child.status', 'active')
            ->where('p.type', $type)
            ->where('p.status', $productStatus)
            ->select(
                'parent.slug as parent_slug',
                'parent.sort_order as parent_sort_order',
                'child.slug as sub_slug',
                'child.title as sub_title',
                'child.sort_order as sub_sort_order'
            )
            ->distinct()
            ->orderBy('parent_sort_order')
            ->orderBy('child.sort_order')
            ->get();

        $subcategories = [];
        foreach ($subRows as $row) {
            $subcategories[$row->parent_slug][] = [
                'value' => $row->sub_slug,
                'label' => $row->sub_title,
            ];
        }

        if ($selectedSubcategory !== 'all') {
            $validChildSlugs = $selectedCategory === 'all'
                ? collect($subcategories)->flatten()->pluck('value')->all()
                : collect($subcategories[$selectedCategory] ?? [])->pluck('value')->all();

            if (! in_array($selectedSubcategory, $validChildSlugs, true)) {
                $selectedSubcategory = 'all';
            }
        }

        $productQuery = DB::table('products as p')
            ->leftJoin('product_images as pi_primary', function ($join) {
                $join->on('pi_primary.product_id', '=', 'p.id')->where('pi_primary.is_primary', 1);
            })
            ->leftJoin('product_images as pi_fallback', function ($join) {
                $join->on('pi_fallback.product_id', '=', 'p.id');
                $join->whereRaw(
                    'pi_fallback.sort_order = (select min(pi2.sort_order) from product_images pi2 where pi2.product_id = p.id)'
                );
            })
            ->select(
                'p.id',
                'p.title',
                'p.slug',
                'p.price',
                'p.discount',
                DB::raw('COALESCE(pi_primary.url, pi_fallback.url) as image_url'),
                'p.sort_order'
            )
            ->where('p.type', $type)
            ->where('p.status', $productStatus);

        if ($selectedSubcategory !== 'all') {
            $childId = Category::query()->where('slug', $selectedSubcategory)->value('id');
            if ($childId) {
                $productQuery->where('p.category_id', $childId);
            } else {
                $productQuery->whereRaw('1=0');
            }
        } elseif ($selectedCategory !== 'all') {
            $parentId = Category::query()->where('slug', $selectedCategory)->value('id');
            if ($parentId) {
                $childIds = DB::table('category_relations')
                    ->where('category_id', $parentId)
                    ->pluck('sub_category_id')
                    ->all();

                if (! empty($childIds)) {
                    $productQuery->whereIn('p.category_id', $childIds);
                } else {
                    $productQuery->whereRaw('1=0');
                }
            } else {
                $productQuery->whereRaw('1=0');
            }
        }

        $total = (clone $productQuery)->distinct()->count('p.id');
        $totalPages = (int) ceil($total / $perPage);

        $products = $productQuery
            ->orderBy('p.sort_order', 'desc')
            ->offset($offset)
            ->limit($perPage)
            ->get();

        return Inertia::render('frontend/sweatsuitsmen', [
            'categories' => $categories,
            'subcategories' => $subcategories,
            'selectedCategory' => $selectedCategory,
            'selectedSubcategory' => $selectedSubcategory,
            'products' => $products,
            'currentPage' => $page,
            'perPage' => $perPage,
            'totalPages' => $totalPages,
        ]);
    }

    public function orders(): Response
    {
        return Inertia::render('frontend/User/orders');
    }

    public function orders2(): Response
    {
        return Inertia::render('frontend/User/orders2');
    }

    public function shippings(): Response
    {
        return Inertia::render('frontend/shippings');
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('frontend/privacy-policy');
    }

    public function termsAndConditions(): Response
    {
        return Inertia::render('frontend/terms-and-conditions');
    }
}
