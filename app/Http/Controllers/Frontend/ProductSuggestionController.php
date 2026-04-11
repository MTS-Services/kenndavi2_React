<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductRecommendationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    public function aiSuggestion(Request $request): Response
    {
        return Inertia::render('frontend/products/ai-suggestion');
    }
}
