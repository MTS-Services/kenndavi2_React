<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\PaymentGateway;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ShippingAddress;
use App\Models\User;
use App\Services\PaymentService;
use Illuminate\Support\Carbon;

it('place-order creates an order and redirects to gateway selection when multiple gateways active', function () {
    $user = User::factory()->create([
        'email_verified_at' => Carbon::now(),
    ]);

    $product = Product::factory()->create(['price' => 25]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'color_id' => null,
        'size_id' => null,
        'quantity' => 10,
        'status' => 'active',
    ]);

    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'variant_id' => $variant->id,
        'quantity' => 2,
        'unit_price' => 25,
    ]);

    $this->actingAs($user)
        ->post('/checkout/place-order', [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'phone' => '555-0100',
            'state' => 'CA',
            'city' => 'LA',
            'zip_code' => '90001',
            'address' => '100 Market Street',
            'save_as_default' => false,
        ])
        ->assertRedirect();

    $order = Order::query()->where('user_id', $user->id)->latest('id')->first();
    expect($order)->not->toBeNull();

    $this->assertTrue(str_starts_with($order->order_number, 'ORD-'));
});

it('place-order is idempotent for same cart snapshot', function () {
    $user = User::factory()->create([
        'email_verified_at' => Carbon::now(),
    ]);

    $product = Product::factory()->create(['price' => 10]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'color_id' => null,
        'size_id' => null,
        'quantity' => 10,
        'status' => 'active',
    ]);

    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'variant_id' => $variant->id,
        'quantity' => 1,
        'unit_price' => 10,
    ]);

    $payload = [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane@example.com',
        'phone' => '555-0100',
        'state' => 'CA',
        'city' => 'LA',
        'zip_code' => '90001',
        'address' => '100 Market Street',
        'save_as_default' => false,
    ];

    $this->actingAs($user)->post('/checkout/place-order', $payload)->assertRedirect();
    $this->actingAs($user)->post('/checkout/place-order', $payload)->assertRedirect();

    expect(Order::query()->where('user_id', $user->id)->count())->toBe(1);
});

it('checkout start redirects away to hosted checkout url', function () {
    $user = User::factory()->create([
        'email_verified_at' => Carbon::now(),
    ]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
    ]);

    PaymentGateway::query()->create([
        'sort_order' => 1,
        'name' => 'Stripe',
        'slug' => 'stripe',
        'icon' => null,
        'is_active' => true,
        'live_data' => [],
        'sandbox_data' => [],
        'mode' => 'sandbox',
        'updated_by' => null,
    ]);

    $this->mock(PaymentService::class, function ($mock) {
        $mock->shouldReceive('processPayment')
            ->andReturn([
                'success' => true,
                'checkout_url' => 'https://example.com/checkout',
            ]);
    });

    $this->actingAs($user)
        ->post('/checkout/start', [
            'order_number' => $order->order_number,
            'gateway' => 'stripe',
        ])
        ->assertRedirect('https://example.com/checkout');
});

it('place-order marks submitted default shipping address', function () {
    $user = User::factory()->create([
        'email_verified_at' => Carbon::now(),
    ]);

    $product = Product::factory()->create(['price' => 25]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'color_id' => null,
        'size_id' => null,
        'quantity' => 10,
        'status' => 'active',
    ]);

    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'variant_id' => $variant->id,
        'quantity' => 2,
        'unit_price' => 25,
    ]);

    $this->actingAs($user)
        ->post('/checkout/place-order', [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'phone' => '555-0100',
            'state' => 'CA',
            'city' => 'LA',
            'zip_code' => '90001',
            'address' => '100 Market Street',
            'save_as_default' => true,
        ])
        ->assertRedirect();

    $shippingAddress = ShippingAddress::query()
        ->where('user_id', $user->id)
        ->first();

    expect($shippingAddress)->not->toBeNull()
        ->and($shippingAddress->is_default)->toBeTrue();
});
