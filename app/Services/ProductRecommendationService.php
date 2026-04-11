<?php

namespace App\Services;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\ProductView;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductRecommendationService
{
    private const REASON_SIMILAR = 'Similar items';

    private const REASON_TRENDING = 'Trending now';

    private const REASON_BROWSING = 'Based on your browsing';

    private const REASON_PURCHASES = 'Matches your purchases';

    private const REASON_CATEGORY = 'More in this category';

    public function vectorsEnabled(): bool
    {
        return Schema::getConnection()->getDriverName() === 'pgsql'
            && Schema::hasColumn('products', 'embedding');
    }

    /**
     * @return list<array{id: int, title: string, slug: string|null, image_url: string|null, reason: string, score: float}>
     */
    public function forProductPage(Product $current, ?User $user, string $sessionId, int $limit = 10): array
    {
        $current->loadMissing(['images', 'category', 'subcategory']);

        $scores = [];

        foreach ($this->semanticCandidates($current) as $row) {
            $sim = max(0.0, (float) $row->score);
            $this->addScore($scores, (int) $row->id, $sim * 85.0, self::REASON_SIMILAR);
        }

        foreach ($this->purchaseCandidates($current, $user) as $p) {
            $this->addScore($scores, $p->id, 22.0, self::REASON_PURCHASES);
        }

        foreach ($this->browsingCandidates($current, $user, $sessionId) as $p) {
            $this->addScore($scores, $p->id, 18.0, self::REASON_BROWSING);
        }

        foreach ($this->sameCategoryCandidates($current) as $p) {
            $this->addScore($scores, $p->id, 12.0, self::REASON_CATEGORY);
        }

        foreach ($this->trendingCandidates($current) as $row) {
            $w = min(35.0, 8.0 + log(1.0 + (float) $row->trend_score) * 6.0);
            $this->addScore($scores, (int) $row->id, $w, self::REASON_TRENDING);
        }

        uasort($scores, fn (array $a, array $b): int => $b['score'] <=> $a['score']);

        $ids = array_keys(array_slice($scores, 0, $limit, true));

        if ($ids === []) {
            return [];
        }

        $products = Product::query()
            ->whereIn('id', $ids)
            ->where('status', ProductStatus::ACTIVE)
            ->with(['images' => fn ($q) => $q->orderByDesc('is_primary')->orderBy('sort_order')])
            ->get()
            ->keyBy('id');

        $ordered = [];
        foreach ($ids as $id) {
            $p = $products->get($id);
            if ($p === null) {
                continue;
            }
            $primary = $p->images->first();
            $ordered[] = [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'image_url' => $primary?->url,
                'reason' => $scores[$id]['reason'],
                'score' => round($scores[$id]['score'], 2),
            ];
        }

        return $ordered;
    }

    /**
     * @param  array<int, array{score: float, reason: string}>  $scores
     */
    protected function addScore(array &$scores, int $productId, float $weight, string $reason): void
    {
        if (! isset($scores[$productId])) {
            $scores[$productId] = ['score' => 0.0, 'reason' => $reason];
        }

        $scores[$productId]['score'] += $weight;
    }

    /**
     * @return list<object{id: int, score: float}>
     */
    protected function semanticCandidates(Product $current): array
    {
        if (! $this->vectorsEnabled()) {
            return [];
        }

        $rows = DB::select(
            'SELECT p.id AS id, (1 - (p.embedding <=> c.embedding))::float AS score
             FROM products p
             INNER JOIN products c ON c.id = ?
             WHERE p.id != c.id
               AND p.status = ?
               AND p.embedding IS NOT NULL
               AND c.embedding IS NOT NULL
               AND (1 - (p.embedding <=> c.embedding)) >= 0.35
             ORDER BY p.embedding <=> c.embedding
             LIMIT 12',
            [$current->id, ProductStatus::ACTIVE->value]
        );

        return $rows;
    }

    /**
     * @return Collection<int, Product>
     */
    protected function sameCategoryCandidates(Product $current): Collection
    {
        $q = Product::query()
            ->where('id', '!=', $current->id)
            ->where('status', ProductStatus::ACTIVE)
            ->where('type', $current->type->value)
            ->limit(8);

        if ($current->category_id) {
            $q->where('category_id', $current->category_id);
        }

        return $q->inRandomOrder()->get();
    }

    /**
     * @return Collection<int, Product>
     */
    protected function browsingCandidates(Product $current, ?User $user, string $sessionId): Collection
    {
        $viewQuery = ProductView::query()
            ->select('product_id')
            ->where('product_id', '!=', $current->id)
            ->where('created_at', '>=', now()->subDays(90))
            ->orderByDesc('created_at')
            ->limit(25);

        if ($user) {
            $viewQuery->where('user_id', $user->id);
        } else {
            $viewQuery->where('session_id', $sessionId);
        }

        $seenIds = $viewQuery->pluck('product_id')->unique()->values();

        if ($seenIds->isEmpty()) {
            return collect();
        }

        $categoryIds = Product::query()
            ->whereIn('id', $seenIds)
            ->pluck('category_id')
            ->filter()
            ->unique()
            ->values();

        if ($categoryIds->isEmpty()) {
            return collect();
        }

        return Product::query()
            ->where('id', '!=', $current->id)
            ->where('status', ProductStatus::ACTIVE)
            ->whereIn('category_id', $categoryIds)
            ->inRandomOrder()
            ->limit(8)
            ->get();
    }

    /**
     * @return Collection<int, Product>
     */
    protected function purchaseCandidates(Product $current, ?User $user): Collection
    {
        if ($user === null) {
            return collect();
        }

        $statuses = [
            OrderStatus::DELIVERED->value,
            OrderStatus::COMPLETED->value,
            OrderStatus::SHIPPED->value,
            OrderStatus::CONFIRMED->value,
        ];

        $productIds = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('product_variants', 'product_variants.id', '=', 'order_items.variant_id')
            ->where('orders.user_id', $user->id)
            ->where('orders.payment_status', OrderPaymentStatus::PAID->value)
            ->whereIn('orders.status', $statuses)
            ->where('product_variants.product_id', '!=', $current->id)
            ->orderByDesc('order_items.created_at')
            ->limit(40)
            ->pluck('product_variants.product_id')
            ->unique()
            ->values();

        if ($productIds->isEmpty()) {
            return collect();
        }

        $categoryIds = Product::query()
            ->whereIn('id', $productIds)
            ->pluck('category_id')
            ->filter()
            ->unique();

        if ($categoryIds->isEmpty()) {
            return collect();
        }

        return Product::query()
            ->where('id', '!=', $current->id)
            ->where('status', ProductStatus::ACTIVE)
            ->whereIn('category_id', $categoryIds)
            ->inRandomOrder()
            ->limit(8)
            ->get();
    }

    /**
     * @return list<object{id: int, trend_score: float}>
     */
    protected function trendingCandidates(Product $current): array
    {
        if (! Schema::hasTable('product_views')) {
            return [];
        }

        return DB::select(
            'SELECT pv.product_id AS id, COUNT(*)::float AS trend_score
             FROM product_views pv
             INNER JOIN products p ON p.id = pv.product_id
             WHERE pv.created_at >= ?
               AND p.status = ?
               AND p.id != ?
             GROUP BY pv.product_id
             ORDER BY trend_score DESC
             LIMIT 15',
            [now()->subDays(30), ProductStatus::ACTIVE->value, $current->id]
        );
    }
}
