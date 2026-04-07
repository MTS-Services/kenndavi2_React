<?php

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Models\Admin;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\ShippingAddress;
use App\Models\User;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('guests cannot access orders index', function () {
    $this->get(route('admin.orders.index'))->assertRedirect(route('admin.login'));
});

test('guests cannot access order show', function () {
    $order = Order::factory()->create();

    $this->get(route('admin.orders.show', $order))->assertRedirect(route('admin.login'));
});

test('guests cannot ship an order', function () {
    $order = Order::factory()->create();

    $this->post(route('admin.orders.ship', $order))->assertRedirect(route('admin.login'));
});

test('guests cannot mark a shipped order as delivered', function () {
    $order = Order::factory()->create([
        'status' => OrderStatus::SHIPPED->value,
    ]);

    $this->post(route('admin.orders.deliver', $order))->assertRedirect(route('admin.login'));
});

test('admin can view orders index with inertia props', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.orders.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backend/Admin/order/index')
        ->has('orders')
        ->has('orders.data')
        ->has('counts')
        ->has('activeTab')
    );
});

test('admin orders index respects tab shipped filter', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->for($user)->create();
    $address = ShippingAddress::factory()->create([
        'cart_id' => $cart->id,
        'user_id' => $user->id,
    ]);

    $shipped = Order::factory()->create([
        'user_id' => $user->id,
        'shipping_address_id' => $address->id,
        'status' => OrderStatus::SHIPPED->value,
        'payment_status' => OrderPaymentStatus::PAID->value,
    ]);

    Order::factory()->create([
        'user_id' => $user->id,
        'shipping_address_id' => $address->id,
        'status' => OrderStatus::CONFIRMED->value,
        'payment_status' => OrderPaymentStatus::PAID->value,
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.orders.index', ['tab' => 'shipped']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backend/Admin/order/index')
        ->where('activeTab', 'shipped')
        ->where('orders.total', 1)
        ->where('orders.data.0.id', $shipped->id)
    );
});

test('admin can view order show', function () {
    $order = Order::factory()->create();

    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.orders.show', $order));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backend/Admin/order/show')
        ->has('order')
        ->where('order.id', $order->id)
    );
});

test('admin can mark paid confirmed order as shipped', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->for($user)->create();
    $address = ShippingAddress::factory()->create([
        'cart_id' => $cart->id,
        'user_id' => $user->id,
    ]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'shipping_address_id' => $address->id,
        'status' => OrderStatus::CONFIRMED->value,
        'payment_status' => OrderPaymentStatus::PAID->value,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'variant_id' => null,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.orders.index', ['tab' => 'pending']))
        ->post(route('admin.orders.ship', $order))
        ->assertRedirect(route('admin.orders.index', ['tab' => 'pending']))
        ->assertSessionHas('toast');

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::SHIPPED);

    expect(OrderStatusHistory::query()->where('order_id', $order->id)->count())->toBe(1);
});

test('admin cannot mark initialized unpaid order as shipped', function () {
    $order = Order::factory()->create([
        'status' => OrderStatus::INITIALIZED->value,
        'payment_status' => OrderPaymentStatus::UNPAID->value,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.orders.index'))
        ->post(route('admin.orders.ship', $order))
        ->assertSessionHas('toast');
});

test('admin can mark shipped order as delivered', function () {
    $order = Order::factory()->create([
        'status' => OrderStatus::SHIPPED->value,
        'payment_status' => OrderPaymentStatus::PAID->value,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.orders.index', ['tab' => 'shipped']))
        ->post(route('admin.orders.deliver', $order))
        ->assertRedirect(route('admin.orders.index', ['tab' => 'shipped']))
        ->assertSessionHas('toast');

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::DELIVERED);

    expect(OrderStatusHistory::query()->where('order_id', $order->id)->count())->toBe(1);
});

test('admin cannot mark confirmed order as delivered', function () {
    $order = Order::factory()->create([
        'status' => OrderStatus::CONFIRMED->value,
        'payment_status' => OrderPaymentStatus::PAID->value,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.orders.index', ['tab' => 'shipped']))
        ->post(route('admin.orders.deliver', $order))
        ->assertSessionHas('toast');
});
