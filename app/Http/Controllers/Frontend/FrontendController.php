<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ProductStatus;
use App\Enums\ProductType;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

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
        return $this->catalogListing($request, ProductType::WOMEN, 'frontend/hoodies-women');
    }

    public function sweatsuitsMen(Request $request): Response
    {
        return $this->catalogListing($request, ProductType::MEN, 'frontend/sweatsuitsmen');
    }

    public function accessoriesCatalog(Request $request): Response
    {
        return $this->catalogListing($request, ProductType::ACCESSORIES, 'frontend/accessories-catalog');
    }

    /**
     * Shared product grid for men / women / accessories listing pages.
     */
    private function catalogListing(Request $request, ProductType $productType, string $component): Response
    {
        $productStatus = ProductStatus::ACTIVE->value;
        $type = $productType->value;

        $selectedCategory = $this->normalizeCatalogFilterId($request->query('category', 'all'));
        $selectedSubcategory = $this->normalizeCatalogFilterId($request->query('subcategory', 'all'));
        $page = max(1, (int) $request->query('page', 1));
        $perPage = 4;
        $offset = ($page - 1) * $perPage;

        $parents = DB::table('category_relations as cr')
            ->join('categories as parent', 'parent.id', '=', 'cr.category_id')
            ->join('categories as child', 'child.id', '=', 'cr.sub_category_id')
            ->join('products as p', 'p.category_id', '=', 'child.id')
            ->where('parent.status', 'active')
            ->where('child.status', 'active')
            ->where('p.type', $type)
            ->where('p.status', $productStatus)
            ->select('parent.id', 'parent.title', 'parent.sort_order')
            ->distinct()
            ->orderBy('parent.sort_order')
            ->get();

        $categories = $parents
            ->map(fn ($c) => ['value' => (string) $c->id, 'label' => $c->title])
            ->values()
            ->all();

        $validParentIds = $parents->pluck('id')->map(fn ($id) => (string) $id)->all();
        if ($selectedCategory !== 'all' && ! in_array($selectedCategory, $validParentIds, true)) {
            $selectedCategory = 'all';
        }

        $subRows = DB::table('category_relations as cr')
            ->join('categories as parent', 'parent.id', '=', 'cr.category_id')
            ->join('categories as child', 'child.id', '=', 'cr.sub_category_id')
            ->join('products as p', 'p.category_id', '=', 'child.id')
            ->where('parent.status', 'active')
            ->where('child.status', 'active')
            ->where('p.type', $type)
            ->where('p.status', $productStatus)
            ->select(
                'parent.id as parent_id',
                'parent.sort_order as parent_sort_order',
                'child.id as child_id',
                'child.title as sub_title',
                'child.sort_order as sub_sort_order'
            )
            ->distinct()
            ->orderBy('parent_sort_order')
            ->orderBy('sub_sort_order')
            ->get();

        $subcategories = [];
        foreach ($subRows as $row) {
            $key = (string) $row->parent_id;
            $subcategories[$key][] = [
                'value' => (string) $row->child_id,
                'label' => $row->sub_title,
            ];
        }

        if ($selectedSubcategory !== 'all') {
            $validChildIds = $selectedCategory === 'all'
                ? collect($subcategories)->flatten(1)->pluck('value')->unique()->values()->all()
                : collect($subcategories[$selectedCategory] ?? [])->pluck('value')->all();

            if (! in_array($selectedSubcategory, $validChildIds, true)) {
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
            $productQuery->where('p.category_id', (int) $selectedSubcategory);
        } elseif ($selectedCategory !== 'all') {
            $parentId = (int) $selectedCategory;
            $childIds = DB::table('category_relations')
                ->where('category_id', $parentId)
                ->pluck('sub_category_id')
                ->all();

            if (! empty($childIds)) {
                $productQuery->whereIn('p.category_id', $childIds);
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

        return Inertia::render($component, [
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

    /**
     * @return 'all'|numeric-string
     */
    private function normalizeCatalogFilterId(mixed $value): string
    {
        if ($value === 'all' || $value === null || $value === '') {
            return 'all';
        }

        $s = (string) $value;
        if (! ctype_digit($s)) {
            return 'all';
        }

        $id = (int) $s;

        return $id >= 1 ? (string) $id : 'all';
    }
}
