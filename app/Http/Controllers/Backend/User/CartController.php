<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class CartController extends Controller
{
    public function index(Request $request, CartService $cartService): Response
    {
        $cart = $cartService->resolveCart($request);
        $cart->load([
            'items.variant.product.images',
            'items.variant.color',
            'items.variant.size',
        ]);

        $items = $cart->items->map(function (CartItem $item) use ($cartService) {
            $variant = $item->variant;
            $product = $variant?->product;
            $image = $product?->images
                ?->sortByDesc('is_primary')
                ->sortBy('sort_order')
                ->first();

            $url = $image?->url;
            $resolved = $cartService->resolveImageUrl($url);

            return [
                'id' => $item->id,
                'product_id' => $product?->id,
                'title' => $product?->title ?? __('Product'),
                'image_url' => $resolved,
                'image_alt' => $image?->alt_text ?? $product?->title,
                'color' => $variant?->color?->name,
                'size' => $variant?->size?->name,
                'unit_price' => (float) $item->unit_price,
                'quantity' => $item->quantity,
                'max_quantity' => (int) ($variant?->quantity ?? 0),
                'line_total' => round((float) $item->unit_price * $item->quantity, 2),
                'variant_id' => $variant?->id,
            ];
        })->values();

        $subtotal = round($items->sum('line_total'), 2);

        return Inertia::render('backend/User/cart/index', [
            'items' => $items,
            'subtotal' => $subtotal,
            'item_count' => $items->sum('quantity'),
            'is_empty' => $items->isEmpty(),
            'is_authenticated' => $request->user() !== null,
        ]);
    }

    public function store(StoreCartItemRequest $request, CartService $cartService): RedirectResponse
    {
        $variant = ProductVariant::query()->findOrFail($request->validated('variant_id'));
        $cart = $cartService->resolveCart($request);

        try {
            $cartService->addOrMergeLine($cart, $variant, (int) $request->validated('quantity'));
        } catch (InvalidArgumentException $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
        }

        return redirect()
            ->route('cart.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Added to cart.'),
            ]);
    }

    public function update(
        UpdateCartItemRequest $request,
        CartItem $cartItem,
        CartService $cartService,
    ): RedirectResponse {
        try {
            $cartService->updateLineQuantity($cartItem, (int) $request->validated('quantity'));
        } catch (InvalidArgumentException $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
        }

        return back()->with('toast', [
            'type' => 'success',
            'message' => __('Cart updated.'),
        ]);
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        $cartItem->delete();

        return back()->with('toast', [
            'type' => 'success',
            'message' => __('Item removed.'),
        ]);
    }
}
