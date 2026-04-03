<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ProductStatus;
use App\Enums\ProductType;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductControllerCopy extends Controller
{
    public function category(Request $request, ProductType $type): Response
    {
        $categorySlug = $request->query('category', 'all');

        $query = Product::with([
            'images' => fn($q) => $q->orderByDesc('is_primary')->orderBy('sort_order'),
        ])
            ->where('type', $type)
            ->where('status', ProductStatus::ACTIVE)
            ->when(
                $categorySlug !== 'all',
                fn($q) => $q->whereHas('category', fn($c) => $c->where('slug', $categorySlug))
            )
            ->latest();

        // Categories for the filter dropdown (scoped to this type)
        $categories = Category::whereHas(
            'products',
            fn($q) =>
            $q->where('type', $type)->where('status', ProductStatus::ACTIVE)
        )
            ->orderBy('sort_order')
            ->get()
            ->map(fn($c) => ['value' => $c->slug, 'label' => $c->title]);

        return Inertia::render('frontend/products/category', [
            'products' => Inertia::scroll(
                fn() =>
                $query->paginate(3)->through(fn($p) => [
                    'id'            => $p->id,
                    'title'         => $p->title,
                    'slug'          => $p->slug,
                    'price'         => (float) $p->price,
                    'discount'      => (float) ($p->discount ?? 0),
                    'discount_type' => $p->discount_type?->value ?? 'percentage',
                    // Always return exactly 4 image slots (pad with the first image)
                    'images'        => collect($p->images->take(4))
                        ->pipe(function ($imgs) use ($p) {
                            $list = $imgs->map(fn($img) => [
                                'url' => $img->http_url,
                                'alt' => $img->alt_text ?? $p->title,
                            ])->values()->toArray();

                            $fallback = $list[0] ?? ['url' => null, 'alt' => $p->title];
                            while (count($list) < 4) {
                                $list[] = $fallback;
                            }

                            return $list;
                        }),
                ])
            ),
            'type'              => $type->value,
            'type_label'        => $type->label(),
            'categories'        => $categories,
            'selected_category' => $categorySlug,
        ]);
    }

    public function details(int $id): Response
    {
        $product = Product::findOrFail($id);

        $product->load([
            'images',
            'variants.color',
            'variants.size',
            'reviews.user',
        ]);

        $approvedReviews = $product->reviews->where('status.value', 'approved');
        $avgRating       = $approvedReviews->avg('rating') ?? 0;
        $reviewCount     = $approvedReviews->count();

        $distribution = [];
        for ($star = 5; $star >= 1; $star--) {
            $count          = $approvedReviews->where('rating', $star)->count();
            $distribution[] = [
                'star'    => $star,
                'count'   => $count,
                'percent' => $reviewCount > 0 ? round(($count / $reviewCount) * 100) : 0,
            ];
        }

        return Inertia::render('frontend/products/details', [
            'product' => [
                'id'                  => $product->id,
                'title'               => $product->title,
                'description'         => $product->description,
                'price'               => (float) $product->price,
                'discount'            => (float) ($product->discount ?? 0),
                'discount_type'       => $product->discount_type?->value ?? 'percentage',
                'stock'               => $product->variants->sum('quantity'),
                'avg_rating'          => round($avgRating, 1),
                'review_count'        => $reviewCount,
                'rating_distribution' => $distribution,

                'images' => $product->images
                    ->sortByDesc('is_primary')->sortBy('sort_order')->values()
                    ->map(fn($img) => [
                        'id'         => $img->id,
                        'url'        => $img->http_url,
                        'alt'        => $img->alt_text ?? $product->title,
                        'is_primary' => $img->is_primary,
                        'color_id'   => $img->color_id,
                    ]),

                'colors' => $product->variants
                    ->where('quantity', '>', 0)
                    ->filter(fn($v) => $v->color !== null)
                    ->unique('color_id')->values()
                    ->map(fn($v) => [
                        'id'    => $v->color->id,
                        'name'  => $v->color->name,
                        'value' => $v->color->hex,
                    ]),

                'sizes' => $product->variants
                    ->where('quantity', '>', 0)
                    ->filter(fn($v) => $v->size !== null)
                    ->unique('size_id')->values()
                    ->map(fn($v) => ['id' => $v->size->id, 'name' => $v->size->name]),

                'variants' => $product->variants->map(fn($v) => [
                    'id'       => $v->id,
                    'color_id' => $v->color_id,
                    'size_id'  => $v->size_id,
                    'quantity' => $v->quantity,
                ]),

                'reviews' => $approvedReviews
                    ->sortByDesc('created_at')->take(10)->values()
                    ->map(fn($r) => [
                        'id'         => $r->id,
                        'rating'     => $r->rating,
                        'title'      => $r->title,
                        'comment'    => $r->comment,
                        'created_at' => $r->created_at->diffForHumans(),
                        'user'       => [
                            'name'   => $r->user?->name ?? 'Anonymous',
                            'avatar' => $r->user?->avatar ?? null,
                        ],
                    ]),
            ],
        ]);
    }
}
