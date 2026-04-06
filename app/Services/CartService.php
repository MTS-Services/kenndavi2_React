<?php

namespace App\Services;

use App\Enums\DiscountType;
use App\Enums\ProductStatus;
use App\Enums\VariantStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class CartService
{
    public const SESSION_CART_ID_KEY = 'cart.id';

    public const GUEST_CART_TTL_DAYS = 30;

    /**
     * Final unit price for storefront / cart (matches TS computeFinalPrice on details page).
     */
    public function unitPrice(Product $product): string
    {
        $price = (float) $product->price;
        $discount = (float) ($product->discount ?? 0);
        if ($discount <= 0) {
            return number_format($price, 2, '.', '');
        }

        $final = match ($product->discount_type) {
            DiscountType::PERCENTAGE => $price - ($price * $discount / 100),
            DiscountType::FIXED => max(0, $price - $discount),
            default => $price,
        };

        return number_format($final, 2, '.', '');
    }

    public function resolveCart(Request $request): Cart
    {
        if ($request->user()) {
            return Cart::query()->firstOrCreate(
                ['user_id' => $request->user()->id],
                ['expires_at' => null],
            );
        }

        $cartId = $request->session()->get(self::SESSION_CART_ID_KEY);
        if ($cartId !== null) {
            $cart = Cart::query()
                ->whereNull('user_id')
                ->whereKey($cartId)
                ->first();
            if ($cart !== null) {
                return $cart;
            }
            $request->session()->forget(self::SESSION_CART_ID_KEY);
        }

        $cart = Cart::query()->create([
            'user_id' => null,
            'session_id' => $request->session()->getId(),
            'expires_at' => now()->addDays(self::GUEST_CART_TTL_DAYS),
        ]);
        $request->session()->put(self::SESSION_CART_ID_KEY, $cart->id);

        return $cart;
    }

    /**
     * @throws InvalidArgumentException
     */
    public function assertVariantSellableForAdd(ProductVariant $variant): void
    {
        $variant->loadMissing('product');
        $product = $variant->product;
        if ($product === null || $product->status !== ProductStatus::ACTIVE) {
            throw new InvalidArgumentException(__('This product is not available.'));
        }
        if ($variant->status !== VariantStatus::ACTIVE) {
            throw new InvalidArgumentException(__('This variant is not available.'));
        }
        if ($variant->quantity < 1) {
            throw new InvalidArgumentException(__('This item is out of stock.'));
        }
    }

    public function addOrMergeLine(Cart $cart, ProductVariant $variant, int $quantity): void
    {
        if ($quantity < 1) {
            throw new InvalidArgumentException(__('Invalid quantity.'));
        }

        DB::transaction(function () use ($cart, $variant, $quantity): void {
            $variant = ProductVariant::query()->lockForUpdate()->findOrFail($variant->id);
            $this->assertVariantSellableForAdd($variant);

            if ($quantity > $variant->quantity) {
                throw new InvalidArgumentException(__('Not enough stock available.'));
            }

            $product = $variant->product ?? Product::query()->findOrFail($variant->product_id);
            $unit = $this->unitPrice($product);

            $line = CartItem::query()
                ->where('cart_id', $cart->id)
                ->where('variant_id', $variant->id)
                ->lockForUpdate()
                ->first();

            if ($line === null) {
                CartItem::query()->create([
                    'cart_id' => $cart->id,
                    'variant_id' => $variant->id,
                    'quantity' => $quantity,
                    'unit_price' => $unit,
                ]);

                return;
            }

            $newQty = $line->quantity + $quantity;
            if ($newQty > $variant->quantity) {
                throw new InvalidArgumentException(__('Not enough stock available.'));
            }

            $line->update([
                'quantity' => $newQty,
                'unit_price' => $unit,
            ]);
        });
    }

    public function updateLineQuantity(CartItem $line, int $quantity): void
    {
        if ($quantity < 1) {
            throw new InvalidArgumentException(__('Invalid quantity.'));
        }

        DB::transaction(function () use ($line, $quantity): void {
            $variant = ProductVariant::query()->lockForUpdate()->findOrFail($line->variant_id);
            $variant->loadMissing('product');
            $product = $variant->product;
            if ($product === null || $product->status !== ProductStatus::ACTIVE) {
                throw new InvalidArgumentException(__('This product is not available.'));
            }
            if ($quantity > $variant->quantity) {
                throw new InvalidArgumentException(__('Not enough stock available.'));
            }

            $unit = $this->unitPrice($product);
            $line->update([
                'quantity' => $quantity,
                'unit_price' => $unit,
            ]);
        });
    }

    public function mergeGuestCartIntoUserCart(Cart $guest, Cart $user): void
    {
        if ($guest->user_id !== null || $guest->id === $user->id) {
            return;
        }

        $guest->load('items');

        DB::transaction(function () use ($guest, $user): void {
            foreach ($guest->items as $line) {
                $variant = ProductVariant::query()->lockForUpdate()->find($line->variant_id);
                if ($variant === null) {
                    continue;
                }

                $product = Product::query()->find($variant->product_id);
                if ($product === null || $product->status !== ProductStatus::ACTIVE) {
                    continue;
                }

                $unit = $this->unitPrice($product);
                $existing = CartItem::query()
                    ->where('cart_id', $user->id)
                    ->where('variant_id', $variant->id)
                    ->lockForUpdate()
                    ->first();

                $combined = ($existing?->quantity ?? 0) + $line->quantity;
                $targetQty = min($combined, $variant->quantity);
                if ($targetQty < 1) {
                    continue;
                }

                if ($existing !== null) {
                    $existing->update([
                        'quantity' => $targetQty,
                        'unit_price' => $unit,
                    ]);
                } else {
                    CartItem::query()->create([
                        'cart_id' => $user->id,
                        'variant_id' => $variant->id,
                        'quantity' => $targetQty,
                        'unit_price' => $unit,
                    ]);
                }
            }

            $guest->items()->delete();
            $guest->delete();
        });
    }

    public function resolveImageUrl(?string $url): ?string
    {
        if ($url === null || $url === '') {
            return null;
        }
        if (filter_var($url, FILTER_VALIDATE_URL) && (str_starts_with($url, 'https://') || str_starts_with($url, 'http://'))) {
            return $url;
        }

        return Storage::disk('public')->url($url);
    }
}
