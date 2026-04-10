<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductReview;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $range = $this->normalizeRange($request->string('range')->toString());

        [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->resolvePeriodBounds($range);

        $statsCurrent = $this->buildStats($currentStart, $currentEnd);
        $statsPrevious = $this->buildStats($previousStart, $previousEnd);

        $salesOverview = $this->buildSalesOverview($currentStart, $currentEnd);
        $avgSalesByType = $this->buildAverageSalesByType($currentStart, $currentEnd);
        $recentOrders = $this->buildRecentOrders();

        return Inertia::render('backend/Admin/AdminDashboard', [
            'range' => $range,
            'stats' => $statsCurrent,
            'statsTrend' => [
                'total_orders' => $this->calculateTrend($statsCurrent['total_orders'], $statsPrevious['total_orders']),
                'cancel_orders' => $this->calculateTrend($statsCurrent['cancel_orders'], $statsPrevious['cancel_orders']),
                'total_revenue' => $this->calculateTrend($statsCurrent['total_revenue'], $statsPrevious['total_revenue']),
                'total_review' => $this->calculateTrend($statsCurrent['total_review'], $statsPrevious['total_review']),
            ],
            'salesOverview' => $salesOverview,
            'avgSalesByType' => $avgSalesByType,
            'recentOrders' => $recentOrders,
        ]);
    }

    private function normalizeRange(string $range): string
    {
        return in_array($range, ['week', 'month'], true) ? $range : 'week';
    }

    /**
     * @return array{0: CarbonImmutable, 1: CarbonImmutable, 2: CarbonImmutable, 3: CarbonImmutable}
     */
    private function resolvePeriodBounds(string $range): array
    {
        $now = CarbonImmutable::now();

        if ($range === 'month') {
            $currentStart = $now->startOfMonth();
            $currentEnd = $now->endOfMonth();
            $previousStart = $currentStart->subMonth()->startOfMonth();
            $previousEnd = $currentStart->subMonth()->endOfMonth();

            return [$currentStart, $currentEnd, $previousStart, $previousEnd];
        }

        $currentStart = $now->startOfWeek();
        $currentEnd = $now->endOfWeek();
        $previousStart = $currentStart->subWeek()->startOfWeek();
        $previousEnd = $currentStart->subWeek()->endOfWeek();

        return [$currentStart, $currentEnd, $previousStart, $previousEnd];
    }

    /**
     * @return array{total_orders: int, cancel_orders: int, total_revenue: float, total_review: int}
     */
    private function buildStats(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $orders = Order::query()
            ->selectRaw('COUNT(*) as total_orders')
            ->selectRaw("SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as cancel_orders", [OrderStatus::CANCELLED->value])
            ->selectRaw("COALESCE(SUM(CASE WHEN status IN (?, ?) THEN grand_total ELSE 0 END), 0) as total_revenue", [
                OrderStatus::DELIVERED->value,
                OrderStatus::COMPLETED->value,
            ])
            ->whereBetween('created_at', [$start, $end])
            ->first();

        $totalReviews = ProductReview::query()
            ->whereBetween('created_at', [$start, $end])
            ->count();

        return [
            'total_orders' => (int) ($orders?->total_orders ?? 0),
            'cancel_orders' => (int) ($orders?->cancel_orders ?? 0),
            'total_revenue' => (float) ($orders?->total_revenue ?? 0),
            'total_review' => $totalReviews,
        ];
    }

    /**
     * @return array<int, array{label: string, sold_qty: int, sold_amount: float}>
     */
    private function buildSalesOverview(CarbonImmutable $start, CarbonImmutable $end): array
    {
        return OrderItem::query()
            ->selectRaw(
                "COALESCE(CAST(products.id AS CHAR), CONCAT('legacy:', COALESCE(order_items.product_title, ?))) as product_key",
                ['Unknown product'],
            )
            ->selectRaw('MAX(COALESCE(products.title, order_items.product_title, ?)) as label', ['Unknown product'])
            ->selectRaw('SUM(order_items.quantity) as sold_qty')
            ->selectRaw('COALESCE(SUM(order_items.total_price), 0) as sold_amount')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('product_variants', 'product_variants.id', '=', 'order_items.variant_id')
            ->leftJoin('products', 'products.id', '=', 'product_variants.product_id')
            ->whereIn('orders.status', [
                OrderStatus::PENDING->value,
                OrderStatus::CONFIRMED->value,
                OrderStatus::PROCESSING->value,
                OrderStatus::SHIPPED->value,
                OrderStatus::DELIVERED->value,
                OrderStatus::COMPLETED->value,
            ])
            ->whereBetween('orders.created_at', [$start, $end])
            ->groupBy('product_key')
            ->orderByDesc(DB::raw('SUM(order_items.quantity)'))
            ->orderByDesc(DB::raw('SUM(order_items.total_price)'))
            ->limit(7)
            ->get()
            ->map(fn($row): array => [
                'label' => (string) $row->label,
                'sold_qty' => (int) $row->sold_qty,
                'sold_amount' => (float) $row->sold_amount,
            ])
            ->all();
    }

    /**
     * @return array<int, array{type: string, total_units: int, total_sales_amount: float, avg_sale_per_unit: float}>
     */
    private function buildAverageSalesByType(CarbonImmutable $start, CarbonImmutable $end): array
    {
        return DB::table('products')
            ->select('products.type')
            ->selectRaw('COALESCE(SUM(order_items.quantity), 0) as total_units')
            ->selectRaw('COALESCE(SUM(order_items.total_price), 0) as total_sales_amount')
            ->selectRaw('CASE WHEN COALESCE(SUM(order_items.quantity), 0) = 0 THEN 0 ELSE ROUND(SUM(order_items.total_price) / SUM(order_items.quantity), 2) END as avg_sale_per_unit')
            ->leftJoin('product_variants', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('order_items', 'order_items.variant_id', '=', 'product_variants.id')
            ->leftJoin('orders', function ($join) use ($start, $end): void {
                $join->on('orders.id', '=', 'order_items.order_id')
                    ->whereBetween('orders.created_at', [$start, $end])
                    ->whereIn('orders.status', [OrderStatus::DELIVERED->value, OrderStatus::COMPLETED->value]);
            })
            ->groupBy('products.type')
            ->orderByDesc(DB::raw('SUM(order_items.total_price)'))
            ->get()
            ->map(fn($row): array => [
                'type' => ucfirst((string) $row->type),
                'total_units' => (int) $row->total_units,
                'total_sales_amount' => (float) $row->total_sales_amount,
                'avg_sale_per_unit' => (float) $row->avg_sale_per_unit,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildRecentOrders(): array
    {
        return Order::query()
            ->whereNotIn('status', [OrderStatus::INITIALIZED->value, OrderStatus::FAILED->value])
            ->with([
                'user:id,first_name,last_name,email',
                'items:id,order_id,quantity',
            ])
            ->latest('created_at')
            ->limit(4)
            ->get()
            ->map(function (Order $order): array {
                $buyerName = trim(implode(' ', array_filter([
                    $order->user?->first_name,
                    $order->user?->last_name,
                ])));

                if ($buyerName === '') {
                    $buyerName = (string) ($order->user?->email ?? __('Guest'));
                }

                return [
                    'id' => $order->id,
                    'order_number' => '#' . $order->order_number,
                    'buyer_name' => $buyerName,
                    'total_amount' => (float) $order->grand_total,
                    'quantity' => (int) $order->items->sum('quantity'),
                    'status' => (string) $order->status->value,
                    'is_paid' => $order->payment_status->value === 'paid',
                ];
            })
            ->all();
    }

    private function calculateTrend(float|int $current, float|int $previous): float
    {
        $currentValue = (float) $current;
        $previousValue = (float) $previous;

        if ($previousValue === 0.0) {
            if ($currentValue === 0.0) {
                return 0.0;
            }

            return 100.0;
        }

        return round((($currentValue - $previousValue) / $previousValue) * 100, 2);
    }
}
