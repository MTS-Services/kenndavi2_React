<?php

namespace App\Http\Controllers\Backend\User;

use App\Enums\OrderStatus;
use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderItemReviewRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductReview;
use App\Http\Requests\Order\StoreShippingAddressRequest;
use App\Models\ShippingAddress;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    private const ORDERS_PER_PAGE = 8;

    public function index(Request $request): Response
    {
        $userId = (int) $request->user()->id;
        $orders = Order::query()
            ->where('user_id', $userId)
            ->where('status', '!=', OrderStatus::INITIALIZED->value)
            ->with([
                'items' => fn($query) => $query
                    ->select([
                        'id',
                        'order_id',
                        'product_title',
                        'sku',
                        'color_name',
                        'size_name',
                        'image_url',
                        'unit_price',
                        'offer_price',
                        'quantity',
                        'total_price',
                    ])
                    ->with('review:id,order_item_id')
                    ->orderBy('id'),
            ])
            ->orderByDesc('created_at')
            ->paginate(self::ORDERS_PER_PAGE)
            ->withQueryString()
            ->through(fn(Order $order) => $this->transformOrderListItem($order));

        return Inertia::render('backend/user/order-management/orders', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $this->authorizeOrderOwner($request, $order);

        $order->load([
            'items' => fn($query) => $query->with('review'),
            'payments',
            'shippingAddress',
            'statusHistory' => fn($query) => $query->latest('created_at'),
        ]);

        return Inertia::render('backend/user/order-management/details', [
            'order' => $this->transformOrderDetails($order),
        ]);
    }

    public function reviewForm(Request $request, Order $order, OrderItem $item): Response
    {
        $this->authorizeReviewFlow($request, $order, $item);

        return Inertia::render('backend/user/order-management/review-form', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $this->orderStatusValue($order),
            ],
            'item' => [
                'id' => $item->id,
                'title' => $item->product_title ?? __('Product'),
                'sku' => $item->sku,
                'image_url' => $this->resolveImageUrl($item->image_url),
                'quantity' => (int) $item->quantity,
                'color' => $item->color_name,
                'size' => $item->size_name,
            ],
        ]);
    }

    public function storeReview(
        StoreOrderItemReviewRequest $request,
        Order $order,
        OrderItem $item,
    ): RedirectResponse {
        $this->authorizeReviewFlow($request, $order, $item);
        $item->loadMissing('variant:id,product_id');

        $productId = $item->variant?->product_id;
        if (! is_int($productId)) {
            return redirect()
                ->route('order.show', $order)
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Unable to submit review for this order item.',
                ]);
        }

        ProductReview::query()->create([
            'product_id' => $productId,
            'user_id' => (int) $request->user()->id,
            'order_item_id' => $item->id,
            'rating' => (int) $request->validated('rating'),
            'title' => $request->validated('title'),
            'comment' => $request->validated('comment'),
            'is_verified' => true,
            'status' => ReviewStatus::PENDING->value,
        ]);

        return redirect()
            ->route('order.show', $order)
            ->with('toast', [
                'type' => 'success',
                'message' => 'Review submitted successfully.',
            ]);
    }

    public function shipping(Request $request, CartService $cartService): Response|RedirectResponse
    {
        $cart = $cartService->resolveCart($request);
        $cart->load([
            'items.variant.product.images',
            'items.variant.color',
            'items.variant.size',
        ]);

        if ($cart->items->isEmpty()) {
            return redirect()
                ->route('cart.index')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Your cart is empty.',
                ]);
        }

        $userId = (int) $request->user()->id;
        $shippingAddress = ShippingAddress::query()
            ->where('cart_id', $cart->id)
            ->where('user_id', $userId)
            ->first();

        $items = $cart->items->map(function ($item) use ($cartService) {
            $variant = $item->variant;
            $product = $variant?->product;
            $image = $product?->images
                ?->sortByDesc('is_primary')
                ->sortBy('sort_order')
                ->first();

            $resolved = $cartService->resolveImageUrl($image?->url);

            return [
                'id' => $item->id,
                'title' => $product?->title ?? 'Product',
                'image_url' => $resolved,
                'image_alt' => $image?->alt_text ?? $product?->title,
                'color' => $variant?->color?->name,
                'size' => $variant?->size?->name,
                'unit_price' => (float) $item->unit_price,
                'quantity' => (int) $item->quantity,
                'line_total' => round((float) $item->unit_price * (int) $item->quantity, 2),
            ];
        })->values();

        $subtotal = round($items->sum('line_total'), 2);

        return Inertia::render('backend/user/order-management/shipping', [
            'shippingAddress' => $shippingAddress ? [
                'first_name' => $shippingAddress->first_name,
                'last_name' => $shippingAddress->last_name,
                'email' => $shippingAddress->email,
                'phone' => $shippingAddress->phone,
                'state' => $shippingAddress->state,
                'city' => $shippingAddress->city,
                'zip_code' => $shippingAddress->zip_code,
                'address' => $shippingAddress->address,
            ] : null,
            'cartItems' => $items,
            'subtotal' => $subtotal,
            'itemCount' => (int) $cart->items->sum('quantity'),
        ]);
    }

    public function storeShipping(
        StoreShippingAddressRequest $request,
        CartService $cartService,
    ): RedirectResponse {
        $cart = $cartService->resolveCart($request);
        $cart->loadCount('items');

        if ($cart->items_count < 1) {
            return redirect()
                ->route('cart.index')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Your cart is empty.',
                ]);
        }

        $userId = (int) $request->user()->id;
        if ((int) $cart->user_id !== $userId) {
            abort(403);
        }

        $data = $request->validated();
        unset($data['save_as_default']);

        ShippingAddress::query()->updateOrCreate(
            ['cart_id' => $cart->id, 'user_id' => $userId],
            $data,
        );

        return redirect()
            ->route('order.payment')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Shipping address saved.',
            ]);
    }

    private function authorizeOrderOwner(Request $request, Order $order): void
    {
        if ((int) $order->user_id !== (int) $request->user()->id) {
            abort(403);
        }
    }

    private function authorizeReviewFlow(Request $request, Order $order, OrderItem $item): void
    {
        $this->authorizeOrderOwner($request, $order);

        if ((int) $item->order_id !== (int) $order->id) {
            abort(404);
        }

        if (! $this->canReviewOrder($order)) {
            abort(403);
        }

        if ($item->review()->exists()) {
            abort(403);
        }
    }

    private function canReviewOrder(Order $order): bool
    {
        return in_array($this->orderStatusValue($order), [
            OrderStatus::DELIVERED->value,
            OrderStatus::COMPLETED->value,
        ], true);
    }

    private function orderStatusValue(Order $order): string
    {
        if ($order->status instanceof OrderStatus) {
            return $order->status->value;
        }

        return (string) $order->status;
    }

    /**
     * @return array<string, mixed>
     */
    private function transformOrderListItem(Order $order): array
    {
        $status = $this->orderStatusValue($order);
        $isReviewableOrder = in_array($status, [
            OrderStatus::DELIVERED->value,
            OrderStatus::COMPLETED->value,
        ], true);

        $items = $order->items->map(function (OrderItem $item) use ($isReviewableOrder): array {
            $hasReview = $item->relationLoaded('review') && $item->review !== null;

            return [
                'id' => $item->id,
                'title' => $item->product_title ?? __('Product'),
                'sku' => $item->sku,
                'image_url' => $this->resolveImageUrl($item->image_url),
                'quantity' => (int) $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'total_price' => (float) $item->total_price,
                'color' => $item->color_name,
                'size' => $item->size_name,
                'has_review' => $hasReview,
                'can_review' => $isReviewableOrder && ! $hasReview,
            ];
        })->values();

        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $status,
            'status_label' => OrderStatus::tryFrom($status)?->label() ?? $status,
            'created_at' => $order->created_at?->toIso8601String(),
            'subtotal' => (float) $order->subtotal,
            'discount_amount' => (float) $order->discount_amount,
            'shipping_cost' => (float) $order->shipping_cost,
            'tax_amount' => (float) $order->tax_amount,
            'grand_total' => (float) $order->grand_total,
            'items_count' => $items->count(),
            'items' => $items,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformOrderDetails(Order $order): array
    {
        $status = $this->orderStatusValue($order);
        $isReviewableOrder = in_array($status, [
            OrderStatus::DELIVERED->value,
            OrderStatus::COMPLETED->value,
        ], true);

        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $status,
            'status_label' => OrderStatus::tryFrom($status)?->label() ?? $status,
            'payment_status' => (string) $order->payment_status,
            'created_at' => $order->created_at?->toIso8601String(),
            'subtotal' => (float) $order->subtotal,
            'discount_amount' => (float) $order->discount_amount,
            'shipping_cost' => (float) $order->shipping_cost,
            'tax_amount' => (float) $order->tax_amount,
            'grand_total' => (float) $order->grand_total,
            'notes' => $order->notes,
            'shipping_address' => $order->shippingAddress ? [
                'first_name' => $order->shippingAddress->first_name,
                'last_name' => $order->shippingAddress->last_name,
                'email' => $order->shippingAddress->email,
                'phone' => $order->shippingAddress->phone,
                'state' => $order->shippingAddress->state,
                'city' => $order->shippingAddress->city,
                'zip_code' => $order->shippingAddress->zip_code,
                'address' => $order->shippingAddress->address,
            ] : null,
            'items' => $order->items->map(function (OrderItem $item) use ($isReviewableOrder): array {
                $review = $item->review;
                $hasReview = $review !== null;

                return [
                    'id' => $item->id,
                    'title' => $item->product_title ?? __('Product'),
                    'sku' => $item->sku,
                    'image_url' => $this->resolveImageUrl($item->image_url),
                    'quantity' => (int) $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'offer_price' => $item->offer_price !== null ? (float) $item->offer_price : null,
                    'total_price' => (float) $item->total_price,
                    'color' => $item->color_name,
                    'size' => $item->size_name,
                    'has_review' => $hasReview,
                    'can_review' => $isReviewableOrder && ! $hasReview,
                    'review' => $review ? [
                        'id' => $review->id,
                        'rating' => (int) $review->rating,
                        'title' => $review->title,
                        'comment' => $review->comment,
                        'status' => $review->status instanceof ReviewStatus ? $review->status->value : (string) $review->status,
                        'created_at' => $review->created_at?->toIso8601String(),
                    ] : null,
                ];
            })->values(),
            'payments' => $order->payments->map(fn($payment): array => [
                'id' => $payment->id,
                'method' => (string) $payment->method,
                'gateway_txn_id' => $payment->gateway_txn_id,
                'amount' => (float) $payment->amount,
                'currency' => (string) $payment->currency,
                'status' => (string) $payment->status,
                'paid_at' => $payment->paid_at?->toIso8601String(),
            ])->values(),
            'status_history' => $order->statusHistory->map(fn($entry): array => [
                'id' => $entry->id,
                'from_status' => $entry->from_status,
                'to_status' => $entry->to_status,
                'note' => $entry->note,
                'created_at' => $entry->created_at?->toIso8601String(),
            ])->values(),
        ];
    }

    private function resolveImageUrl(?string $url): string
    {
        if (! is_string($url) || $url === '') {
            return '/assets/images/Rectangle 4343.png';
        }

        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://') || str_starts_with($url, '/')) {
            return $url;
        }

        return asset('storage/' . $url);
    }
}
