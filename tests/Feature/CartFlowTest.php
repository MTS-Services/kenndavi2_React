<?php

use App\Enums\ProductStatus;
use App\Enums\VariantStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia;

function createSellableVariant(): ProductVariant
{
    $product = Product::factory()->create([
        'status' => ProductStatus::ACTIVE,
        'price' => 50,
        'discount' => 0,
    ]);

    return ProductVariant::query()->create([
        'product_id' => $product->id,
        'color_id' => null,
        'size_id' => null,
        'quantity' => 20,
        'status' => VariantStatus::ACTIVE,
        'created_by' => null,
        'updated_by' => null,
    ]);
}

it('guest can add to cart and is redirected with toast flash', function () {
    $variant = createSellableVariant();

    $this->post(route('cart.items.store'), [
        'variant_id' => $variant->id,
        'quantity' => 3,
    ])
        ->assertRedirect(route('cart.index'))
        ->assertSessionHas('toast.type', 'success');
});

it('guest sees cart lines on cart index', function () {
    $variant = createSellableVariant();
    $this->post(route('cart.items.store'), [
        'variant_id' => $variant->id,
        'quantity' => 2,
    ]);

    $this->get(route('cart.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('backend/User/cart/index')
            ->has('items', 1)
            ->where('items.0.quantity', 2)
            ->where('is_authenticated', false));
});

it('cannot update cart item belonging to another cart', function () {
    $variant = createSellableVariant();
    $user = User::factory()->create();
    $cart = Cart::factory()->for($user)->create();
    $item = CartItem::query()->create([
        'cart_id' => $cart->id,
        'variant_id' => $variant->id,
        'quantity' => 1,
        'unit_price' => '50.00',
    ]);

    $this->patch(route('cart.items.update', $item), [
        'quantity' => 5,
    ])->assertNotFound();
});

it('merges guest cart into user cart on login event', function () {
    $variant = createSellableVariant();
    $this->post(route('cart.items.store'), [
        'variant_id' => $variant->id,
        'quantity' => 2,
    ]);
    $guestCartId = session(CartService::SESSION_CART_ID_KEY);
    expect($guestCartId)->not->toBeNull();

    $user = User::factory()->create();
    Event::dispatch(new Login('web', $user, false));

    expect(Cart::query()->whereKey($guestCartId)->exists())->toBeFalse();

    $userCart = Cart::query()->where('user_id', $user->id)->first();
    expect($userCart)->not->toBeNull();
    expect($userCart->items)->toHaveCount(1)
        ->and((int) $userCart->items->first()->quantity)->toBe(2);
});
