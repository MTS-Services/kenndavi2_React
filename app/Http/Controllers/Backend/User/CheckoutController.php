<?php

namespace App\Http\Controllers\Backend\User;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreShippingAddressRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentGateway;
use App\Models\ShippingAddress;
use App\Services\CartService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class CheckoutController extends Controller
{
    public function placeOrder(
        StoreShippingAddressRequest $request,
        CartService $cartService,
        PaymentService $paymentService,
    ): BaseResponse {
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

        if ((int) $cart->user_id !== (int) $request->user()->id) {
            abort(403);
        }

        foreach ($cart->items as $item) {
            $variant = $item->variant;
            if (! $variant) {
                return redirect()
                    ->route('cart.index')
                    ->with('toast', [
                        'type' => 'error',
                        'message' => 'A cart item is missing its variant. Please update your cart.',
                    ]);
            }

            $variant->refresh();
            if ((int) $variant->quantity < (int) $item->quantity) {
                return redirect()
                    ->route('cart.index')
                    ->with('toast', [
                        'type' => 'error',
                        'message' => 'One or more items are out of stock. Please update your cart.',
                    ]);
            }
        }

        /** @var Order $order */
        $order = DB::transaction(function () use ($request, $cart, $cartService) {
            $userId = (int) $request->user()->id;

            $shippingData = $request->validated();
            $saveAsDefault = (bool) ($shippingData['save_as_default'] ?? false);
            unset($shippingData['save_as_default']);
            $shippingData['is_default'] = $saveAsDefault;

            if ($saveAsDefault) {
                ShippingAddress::query()
                    ->where('user_id', $userId)
                    ->update(['is_default' => false]);
            }

            $shippingAddress = ShippingAddress::query()->updateOrCreate(
                ['cart_id' => $cart->id, 'user_id' => $userId],
                $shippingData,
            );

            $cartItemUpdatedAt = optional($cart->items->max('updated_at'))?->timestamp ?? 0;
            $idempotencyKey = hash('sha256', implode('|', [
                (string) $cart->id,
                (string) $cartItemUpdatedAt,
                (string) $shippingAddress->id,
                (string) $userId,
            ]));

            $existing = Order::query()
                ->where('user_id', $userId)
                ->where('idempotency_key', $idempotencyKey)
                ->first();

            if ($existing) {
                return $existing;
            }

            $subtotal = 0;
            foreach ($cart->items as $item) {
                $variant = $item->variant;
                $subtotal += (float) $item->unit_price * (int) $item->quantity;
            }

            $subtotal = round($subtotal, 2);

            $order = Order::create([
                'order_number' => generate_order_id_hybrid(),
                'idempotency_key' => $idempotencyKey,
                'user_id' => $userId,
                'shipping_address_id' => $shippingAddress->id,
                'subtotal' => $subtotal,
                'discount_amount' => 0,
                'shipping_cost' => 0,
                'tax_amount' => 0,
                'grand_total' => $subtotal,
                'status' => OrderStatus::INITIALIZED->value,
            ]);

            foreach ($cart->items as $item) {
                $variant = $item->variant;
                $product = $variant?->product;
                $image = $product?->images
                    ?->sortByDesc('is_primary')
                    ->sortBy('sort_order')
                    ->first();

                $unit = (float) $item->unit_price;
                $qty = (int) $item->quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'variant_id' => $variant?->id,
                    'product_title' => $product?->title,
                    'sku' => null,
                    'color_name' => $variant?->color?->name,
                    'size_name' => $variant?->size?->name,
                    'image_url' => $cartService->resolveImageUrl($image?->url),
                    'unit_price' => $unit,
                    'offer_price' => null,
                    'quantity' => $qty,
                    'total_price' => round($unit * $qty, 2),
                ]);
            }

            $cart->items()->delete();

            return $order;
        });

        $activeGateways = PaymentGateway::query()
            ->enabled()
            ->get()
            ->filter(fn (PaymentGateway $g) => $g->isSupported())
            ->values();

        if ($activeGateways->count() === 1) {
            $gateway = $activeGateways->first();
            $result = $paymentService->processPayment($order, $gateway->slug, [
                'currency' => 'USD',
            ]);

            if (! ($result['success'] ?? false)) {
                return redirect()
                    ->route('checkout.gateway', ['order' => $order->order_number])
                    ->with('toast', [
                        'type' => 'error',
                        'message' => $result['message'] ?? 'Failed to start payment.',
                    ]);
            }

            return Inertia::location($result['checkout_url']);
        }

        return redirect()->route('checkout.gateway', ['order' => $order->order_number]);
    }

    public function gateway(Request $request, string $order): Response
    {
        $orderModel = Order::query()
            ->where('order_number', $order)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $gateways = PaymentGateway::query()
            ->enabled()
            ->get()
            ->filter(fn (PaymentGateway $g) => $g->isSupported())
            ->map(fn (PaymentGateway $g) => [
                'slug' => $g->slug,
                'name' => $g->name,
            ])
            ->values();

        return Inertia::render('backend/user/order-management/gateway', [
            'orderNumber' => $orderModel->order_number,
            'gateways' => $gateways,
            'grandTotal' => (float) $orderModel->grand_total,
        ]);
    }

    public function start(Request $request, PaymentService $paymentService): BaseResponse
    {
        $validated = $request->validate([
            'order_number' => ['required', 'string', 'max:32'],
            'gateway' => ['required', 'string', 'max:60'],
        ]);

        $order = Order::query()
            ->where('order_number', $validated['order_number'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $gateway = PaymentGateway::query()
            ->where('slug', $validated['gateway'])
            ->where('is_active', true)
            ->firstOrFail();

        $result = $paymentService->processPayment($order, $gateway->slug, [
            'currency' => 'USD',
        ]);

        if (! ($result['success'] ?? false)) {
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => $result['message'] ?? 'Failed to start payment.',
                ]);
        }

        return Inertia::location($result['checkout_url']);
    }
}
