<?php

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Models\Admin;
use App\Models\Cart;
use App\Models\Color;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ShippingAddress;
use App\Models\Size;
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

test('sales overview aggregates by product id and appears in weekly and monthly filters', function () {
    $alpha = Product::factory()->create([
        'title' => 'Alpha Product',
        'type' => 'men',
    ]);
    $beta = Product::factory()->create([
        'title' => 'Beta Product',
        'type' => 'women',
    ]);

    $color = Color::query()->create([
        'name' => 'Blue',
        'hex' => '#0000ff',
    ]);
    $size = Size::query()->create([
        'name' => 'M',
        'sort_order' => 1,
    ]);

    $alphaVariant = ProductVariant::query()->create([
        'product_id' => $alpha->id,
        'color_id' => $color->id,
        'size_id' => $size->id,
        'quantity' => 100,
        'status' => 'active',
    ]);
    $betaVariant = ProductVariant::query()->create([
        'product_id' => $beta->id,
        'color_id' => $color->id,
        'size_id' => $size->id,
        'quantity' => 100,
        'status' => 'active',
    ]);

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
        'variant_id' => $alphaVariant->id,
        'product_title' => 'Legacy Alpha Name',
        'quantity' => 2,
        'total_price' => 200,
    ]);
    OrderItem::factory()->create([
        'order_id' => $secondOrder->id,
        'variant_id' => $alphaVariant->id,
        'product_title' => 'Another Alpha Label',
        'quantity' => 3,
        'total_price' => 300,
    ]);
    OrderItem::factory()->create([
        'order_id' => $firstOrder->id,
        'variant_id' => $betaVariant->id,
        'product_title' => 'Legacy Beta Name',
        'quantity' => 1,
        'total_price' => 50,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard', ['range' => 'week']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('backend/Admin/AdminDashboard')
            ->where('range', 'week')
            ->has('salesOverview', 2)
            ->where('salesOverview.0.label', 'Alpha Product')
            ->where('salesOverview.0.sold_qty', 5)
            ->where('salesOverview.0.sold_amount', 500)
            ->where('salesOverview.1.label', 'Beta Product')
            ->where('salesOverview.1.sold_qty', 1)
            ->where('salesOverview.1.sold_amount', 50)
        );

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard', ['range' => 'month']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('backend/Admin/AdminDashboard')
            ->where('range', 'month')
            ->has('salesOverview', 2)
            ->where('salesOverview.0.label', 'Alpha Product')
            ->where('salesOverview.0.sold_qty', 5)
            ->where('salesOverview.0.sold_amount', 500)
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

