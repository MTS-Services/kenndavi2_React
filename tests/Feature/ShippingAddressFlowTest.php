<?php

use App\Enums\ProductStatus;
use App\Enums\VariantStatus;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ShippingAddress;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function makeSellableVariantForShipping(): ProductVariant
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
        'quantity' => 10,
        'status' => VariantStatus::ACTIVE,
        'created_by' => null,
        'updated_by' => null,
    ]);
}

it('redirects shipping page to cart when cart is empty', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $this->actingAs($user);

    $this->get(route('order.shipping'))
        ->assertRedirect(route('cart.index'))
        ->assertSessionHas('toast.type', 'error');
});

it('renders shipping page with cart summary when cart has items', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $this->actingAs($user);

    $variant = makeSellableVariantForShipping();
    $this->post(route('cart.items.store'), [
        'variant_id' => $variant->id,
        'quantity' => 2,
    ]);

    $this->get(route('order.shipping'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('backend/User/order-management/shipping')
            ->has('cartItems', 1)
            ->where('itemCount', 2));
});

it('stores shipping address and redirects to payment', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $this->actingAs($user);

    $variant = makeSellableVariantForShipping();
    $this->post(route('cart.items.store'), [
        'variant_id' => $variant->id,
        'quantity' => 1,
    ]);

    $payload = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '123456789',
        'state' => 'State',
        'city' => 'City',
        'zip_code' => '12345',
        'address' => '123 Street',
        'save_as_default' => true,
    ];

    $this->post(route('order.shipping.store'), $payload)
        ->assertRedirect(route('order.payment'))
        ->assertSessionHas('toast.type', 'success');

    expect(ShippingAddress::query()->where('user_id', $user->id)->count())->toBeGreaterThan(0);
});
