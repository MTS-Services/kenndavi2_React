<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function details(int $id): Response
    {
        $product = Product::findOrFail($id);

        $product->load([
            'images',
            'variants.color',
            'variants.size',
            'reviews.user',
        ]);

        // Compute aggregates server-side so the component stays clean
        $approvedReviews = $product->reviews->where('status.value', 'approved');

        $avgRating = $approvedReviews->avg('rating') ?? 0;
        $reviewCount = $approvedReviews->count();

        // Rating distribution (1-5 stars)
        $distribution = [];
        for ($star = 5; $star >= 1; $star--) {
            $count = $approvedReviews->where('rating', $star)->count();
            $distribution[] = [
                'star'    => $star,
                'count'   => $count,
                'percent' => $reviewCount > 0 ? round(($count / $reviewCount) * 100) : 0,
            ];
        }

        // Total stock across all variants
        $totalStock = $product->variants->sum('quantity');

        return Inertia::render('frontend/products/details', [
            'product' => [
                'id'            => $product->id,
                'title'         => $product->title,
                'description'   => $product->description,
                'price'         => (float) $product->price,
                'discount'      => (float) ($product->discount ?? 0),
                'discount_type' => $product->discount_type?->value ?? 'percentage',
                'stock'         => $totalStock,
                'avg_rating'    => round($avgRating, 1),
                'review_count'  => $reviewCount,
                'rating_distribution' => $distribution,

                // Images: sorted by sort_order, primary first
                'images' => $product->images
                    ->sortByDesc('is_primary')
                    ->sortBy('sort_order')
                    ->values()
                    ->map(fn($img) => [
                        'id'         => $img->id,
                        'url'        => $img->url,
                        'alt'        => $img->alt_text ?? $product->title,
                        'is_primary' => $img->is_primary,
                        'color_id'   => $img->color_id,
                    ]),

                // Unique colors derived from active variants
                'colors' => $product->variants
                    ->where('quantity', '>', 0)
                    ->filter(fn($v) => $v->color !== null)
                    ->unique('color_id')
                    ->values()
                    ->map(fn($v) => [
                        'id'    => $v->color->id,
                        'name'  => $v->color->name,
                        'value' => $v->color->hex,
                    ]),

                // Unique sizes derived from active variants
                'sizes' => $product->variants
                    ->where('quantity', '>', 0)
                    ->filter(fn($v) => $v->size !== null)
                    ->unique('size_id')
                    ->values()
                    ->map(fn($v) => [
                        'id'   => $v->size->id,
                        'name' => $v->size->name, // e.g. "38", "M", "L"
                    ]),

                // Full variant map so the front-end can look up stock & id
                'variants' => $product->variants->map(fn($v) => [
                    'id'       => $v->id,
                    'color_id' => $v->color_id,
                    'size_id'  => $v->size_id,
                    'quantity' => $v->quantity,
                ]),

                // Latest approved reviews (paginate on a separate endpoint if needed)
                'reviews' => $approvedReviews
                    ->sortByDesc('created_at')
                    ->take(10)
                    ->values()
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
