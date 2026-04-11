<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ProductStatus;
use App\Enums\ProductType;
use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Support\CatalogProductPayload;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function category(Request $request, ProductType $type): Response
    {
        $categorySlug = $request->query('category', 'all');
        $subcategorySlug = $request->query('subcategory', 'all');

        $query = Product::with([
            'images' => fn ($q) => $q->orderByDesc('is_primary')->orderBy('sort_order'),
        ])
            ->where('type', $type)
            ->where('status', ProductStatus::ACTIVE)
            ->when(
                $categorySlug !== 'all',
                // FIX: filter by id, not slug
                fn ($q) => $q->whereHas('category', fn ($c) => $c->where('slug', $categorySlug))
            )
            ->when(
                $subcategorySlug !== 'all',
                // FIX: filter by id, not slug
                fn ($q) => $q->whereHas('subcategory', fn ($c) => $c->where('slug', $subcategorySlug))
            )
            ->inRandomOrder();

        $categories = Category::query()
            ->forType($type)
            ->whereDoesntHave('parents')
            ->with('children')
            ->get()
            ->map(fn ($c) => [
                // FIX: cast to string so frontend === comparison works
                // (URL query params are always strings)
                'value' => (string) $c->slug,
                'label' => $c->title,
                'subcategories' => $c->children
                    ->map(fn ($sub) => [
                        'value' => (string) $sub->slug, // FIX: cast to string
                        'label' => $sub->title,
                    ])
                    ->values(),
            ]);

        return Inertia::render('frontend/products/category', [
            'products' => Inertia::scroll(
                fn () => $query->paginate(3)->through(fn (Product $p) => CatalogProductPayload::from($p))
            ),
            'type' => $type->value,
            'type_label' => $type->label(),
            'categories' => $categories,
            'selected_category' => $categorySlug,    // already a string from query()
            'selected_subcategory' => $subcategorySlug, // already a string from query()
        ]);
    }

    public function details(int $id): Response
    {
        $product = Product::findOrFail($id);

        $product->load([
            'images',
            'variants.color',
            'variants.size',
        ]);

        $reviewQuery = ProductReview::query()
            ->where('product_id', $product->id)
            ->whereIn('status', [
                ReviewStatus::APPROVED->value,
                ReviewStatus::PUBLISHED->value,
            ])
            ->with('user:id,first_name,last_name,email,avatar');

        $avgRating = (float) ((clone $reviewQuery)->avg('rating') ?? 0);
        $reviewCount = (int) ((clone $reviewQuery)->count());

        $distribution = [];
        for ($star = 5; $star >= 1; $star--) {
            $count = (int) ((clone $reviewQuery)->where('rating', $star)->count());
            $distribution[] = [
                'star' => $star,
                'count' => $count,
                'percent' => $reviewCount > 0 ? round(($count / $reviewCount) * 100) : 0,
            ];
        }

        $reviews = (clone $reviewQuery)
            ->latest()
            ->paginate(25, ['*'], 'reviews_page')
            ->withQueryString()
            ->through(fn ($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'title' => $r->title,
                'comment' => $r->comment,
                'created_at' => $r->created_at?->diffForHumans(),
                'user' => [
                    'name' => $r->user?->name ?? 'Anonymous',
                    'avatar' => $r->user?->avatar ?? null,
                ],
            ]);

        return Inertia::render('frontend/products/details', [
            'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'description' => $product->description,
                'price' => (float) $product->price,
                'discount' => (float) ($product->discount ?? 0),
                'discount_type' => $product->discount_type?->value ?? 'percentage',
                'stock' => $product->variants->sum('quantity'),
                'avg_rating' => round($avgRating, 1),
                'review_count' => $reviewCount,
                'rating_distribution' => $distribution,

                'images' => $product->images
                    ->sortByDesc('is_primary')->sortBy('sort_order')->values()
                    ->map(fn ($img) => [
                        'id' => $img->id,
                        'url' => $img->url,
                        'alt' => $img->alt_text ?? $product->title,
                        'is_primary' => $img->is_primary,
                        'color_id' => $img->color_id,
                    ]),

                'colors' => $product->variants
                    ->where('quantity', '>', 0)
                    ->filter(fn ($v) => $v->color !== null)
                    ->unique('color_id')->values()
                    ->map(fn ($v) => [
                        'id' => $v->color->id,
                        'name' => $v->color->name,
                        'value' => $v->color->hex,
                    ]),

                'sizes' => $product->variants
                    ->where('quantity', '>', 0)
                    ->filter(fn ($v) => $v->size !== null)
                    ->unique('size_id')->values()
                    ->map(fn ($v) => ['id' => $v->size->id, 'name' => $v->size->name]),

                'variants' => $product->variants->map(fn ($v) => [
                    'id' => $v->id,
                    'color_id' => $v->color_id,
                    'size_id' => $v->size_id,
                    'quantity' => $v->quantity,
                ]),

                'reviews' => $reviews,
            ],
        ]);
    }
}
