<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductRecommendationService;
use App\Support\CatalogProductPayload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductSuggestionController extends Controller
{
    public function __invoke(
        Request $request,
        Product $product,
        ProductRecommendationService $recommendations,
    ): JsonResponse {
        if ($product->status !== ProductStatus::ACTIVE) {
            return response()->json(['suggestions' => []]);
        }

        return response()->json([
            'suggestions' => $recommendations->forProductPage(
                $product,
                $request->user(),
                $request->session()->getId(),
            ),
        ]);
    }

    public function aiSuggestion(): Response
    {
        return Inertia::render('frontend/products/ai-suggestion', [
            'products' => Inertia::scroll(function () {
                $since = now()->subDays(60);

                $viewScores = DB::table('product_views')
                    ->selectRaw('product_id, COUNT(*) as view_count')
                    ->where('created_at', '>=', $since)
                    ->groupBy('product_id');

                return Product::query()
                    ->with([
                        'images' => fn ($q) => $q->orderByDesc('is_primary')->orderBy('sort_order'),
                    ])
                    ->select('products.*')
                    ->leftJoinSub($viewScores, 'pv', 'pv.product_id', '=', 'products.id')
                    ->where('products.status', ProductStatus::ACTIVE)
                    ->orderByDesc(DB::raw('COALESCE(pv.view_count, 0)'))
                    ->orderByDesc('products.updated_at')
                    ->paginate(3)
                    ->through(fn (Product $p) => CatalogProductPayload::from($p));
            }),
            'page_title' => 'AI suggestions',
            'page_subtitle' => 'Trending and popular picks based on recent views and catalog activity.',
        ]);
    }
}
