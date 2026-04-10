<?php

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Models\Admin;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingAddress;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Carbon::setTestNow(Carbon::parse('2026-04-10 12:00:00'));

    $this->admin = Admin::factory()->create();
    $this->user = User::factory()->create();
    $this->cart = Cart::factory()->create(['user_id' => $this->user->id]);
    $this->address = ShippingAddress::factory()->create([
        'cart_id' => $this->cart->id,
        'user_id' => $this->user->id,
    ]);
});

afterEach(function () {
    Carbon::setTestNow();
});

test('sales overview shows day/date buckets with summed sold amount', function () {
    $firstOrder = Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::PENDING->value,
        'payment_status' => OrderPaymentStatus::PAID->value,
        'created_at' => now()->subHours(4),
        'updated_at' => now()->subHours(4),
    ]);
    $secondOrder = Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::PROCESSING->value,
        'payment_status' => OrderPaymentStatus::PAID->value,
        'created_at' => now()->subHours(2),
        'updated_at' => now()->subHours(2),
    ]);

    OrderItem::factory()->create([
        'order_id' => $firstOrder->id,
        'variant_id' => null,
        'product_title' => 'Item A',
        'quantity' => 2,
        'total_price' => 200,
    ]);
    OrderItem::factory()->create([
        'order_id' => $secondOrder->id,
        'variant_id' => null,
        'product_title' => 'Item B',
        'quantity' => 3,
        'total_price' => 300,
    ]);
    OrderItem::factory()->create([
        'order_id' => $firstOrder->id,
        'variant_id' => null,
        'product_title' => 'Item C',
        'quantity' => 1,
        'total_price' => 50,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard', ['range' => 'week']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('backend/Admin/AdminDashboard')
            ->where('range', 'week')
            ->has('salesOverview', 7)
            ->where('salesOverview.4.label', 'Fri')
            ->where('salesOverview.4.date', '2026-04-10')
            ->where('salesOverview.4.sold_amount', 550)
        );

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard', ['range' => 'month']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('backend/Admin/AdminDashboard')
            ->where('range', 'month')
            ->has('salesOverview', 30)
            ->where('salesOverview.9.label', 'Apr 10')
            ->where('salesOverview.9.date', '2026-04-10')
            ->where('salesOverview.9.sold_amount', 550)
        );
});

test('dashboard stats and recent orders follow business rules', function () {
    $completedOrder = Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::COMPLETED->value,
        'grand_total' => 200,
        'payment_status' => OrderPaymentStatus::PAID->value,
        'created_at' => now()->subDay(),
        'updated_at' => now()->subDay(),
    ]);
    $deliveredOrder = Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::DELIVERED->value,
        'grand_total' => 100,
        'payment_status' => OrderPaymentStatus::PAID->value,
        'created_at' => now()->subHours(7),
        'updated_at' => now()->subHours(7),
    ]);
    $pendingOrder = Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::PENDING->value,
        'grand_total' => 90,
        'payment_status' => OrderPaymentStatus::UNPAID->value,
        'created_at' => now()->subHours(5),
        'updated_at' => now()->subHours(5),
    ]);
    Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::FAILED->value,
        'grand_total' => 999,
        'created_at' => now()->subHour(),
        'updated_at' => now()->subHour(),
    ]);
    Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::INITIALIZED->value,
        'grand_total' => 888,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $oldPendingOrder = Order::factory()->create([
        'user_id' => $this->user->id,
        'shipping_address_id' => $this->address->id,
        'status' => OrderStatus::PENDING->value,
        'grand_total' => 45,
        'created_at' => now()->subMonths(2),
        'updated_at' => now()->subMonths(2),
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard', ['range' => 'week']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('backend/Admin/AdminDashboard')
        ->where('stats.total_orders', 5)
        ->where('stats.total_revenue', 300)
        ->where('stats.cancel_orders', 0)
        ->has('recentOrders', 3)
        ->where('recentOrders.0.id', $pendingOrder->id)
        ->where('recentOrders.1.id', $deliveredOrder->id)
        ->where('recentOrders.2.id', $completedOrder->id)
    );

    $monthResponse = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard', ['range' => 'month']));

    $monthResponse->assertOk();
    $monthResponse->assertInertia(fn (Assert $page) => $page
        ->component('backend/Admin/AdminDashboard')
        ->where('recentOrders.0.id', $pendingOrder->id)
        ->where('recentOrders.1.id', $deliveredOrder->id)
        ->where('recentOrders.2.id', $completedOrder->id)
    );

    expect($oldPendingOrder->created_at->isBefore(now()->startOfMonth()))->toBeTrue();
    expect($completedOrder->id)->not->toBe($oldPendingOrder->id);
});

