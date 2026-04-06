<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreShippingAddressRequest;
use App\Models\ShippingAddress;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
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

        return Inertia::render('backend/User/order-management/shipping', [
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
}
