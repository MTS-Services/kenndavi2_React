<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\ShippingAddress;
use App\Models\User;

it('creates cart with items and links to user', function () {
    $user = User::factory()->create();
    $variant = ProductVariant::factory()->create();

    $cart = Cart::factory()->for($user)->create();

    $item = CartItem::factory()->create([
        'cart_id' => $cart->id,
        'variant_id' => $variant->id,
        'quantity' => 2,
        'unit_price' => 100,
    ]);

    $cart->refresh();
    $item->refresh();

    expect($cart->user->is($user))->toBeTrue()
        ->and($cart->items)->toHaveCount(1)
        ->and($item->cart->is($cart))->toBeTrue()
        ->and($item->variant->is($variant))->toBeTrue();
});

it('creates shipping address for cart and user', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->for($user)->create();

    $address = ShippingAddress::factory()->create([
        'cart_id' => $cart->id,
        'user_id' => $user->id,
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '123456789',
        'state' => 'State',
        'city' => 'City',
        'zip_code' => '12345',
        'address' => '123 Street',
    ]);

    $cart->refresh();
    $user->refresh();

    expect($cart->shippingAddress?->is($address))->toBeTrue()
        ->and($user->shippingAddresses)->toHaveCount(1)
        ->and($address->cart->is($cart))->toBeTrue()
        ->and($address->user->is($user))->toBeTrue();
});
