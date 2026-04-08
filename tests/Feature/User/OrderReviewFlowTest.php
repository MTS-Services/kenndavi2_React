<?php

use App\Enums\OrderStatus;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ProductVariant;
use App\Models\ShippingAddress;
use App\Models\User;
use function Pest\Laravel\actingAs;

test('user can view own orders index', function () {
    $user = User::factory()->create();

    createOrderWithItemFor($user, OrderStatus::PENDING);

    actingAs($user)
        ->get(route('order.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/user/order-management/orders')
            ->has('orders')
            ->has('orders.data')
        );
});

test('user cannot view another users order details', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $order = createOrderWithItemFor($owner, OrderStatus::DELIVERED);

    actingAs($other)
        ->get(route('order.show', $order))
        ->assertForbidden();
});

test('user can open review form only for delivered or completed orders', function () {
    $user = User::factory()->create();
    $deliveredOrder = createOrderWithItemFor($user, OrderStatus::DELIVERED);
    $pendingOrder = createOrderWithItemFor($user, OrderStatus::PENDING);

    $deliveredItem = $deliveredOrder->items()->firstOrFail();
    $pendingItem = $pendingOrder->items()->firstOrFail();

    actingAs($user)
        ->get(route('order.review.create', ['order' => $deliveredOrder, 'item' => $deliveredItem]))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/user/order-management/review-form')
            ->where('order.id', $deliveredOrder->id)
            ->where('item.id', $deliveredItem->id)
        );

    actingAs($user)
        ->get(route('order.review.create', ['order' => $pendingOrder, 'item' => $pendingItem]))
        ->assertForbidden();
});

test('user can submit one review and cannot submit a second review for the same item', function () {
    $user = User::factory()->create();
    $order = createOrderWithItemFor($user, OrderStatus::COMPLETED);
    $item = $order->items()->firstOrFail();

    $payload = [
        'rating' => 5,
        'title' => 'Amazing quality',
        'comment' => 'Loved the fit and fabric quality.',
    ];

    actingAs($user)
        ->post(route('order.review.store', ['order' => $order, 'item' => $item]), $payload)
        ->assertRedirect(route('order.show', $order))
        ->assertSessionHas('toast');

    expect(ProductReview::query()->where('order_item_id', $item->id)->count())->toBe(1);
    expect(ProductReview::query()->where('order_item_id', $item->id)->first())
        ->not->toBeNull()
        ->and(ProductReview::query()->where('order_item_id', $item->id)->first()?->user_id)->toBe($user->id);

    actingAs($user)
        ->post(route('order.review.store', ['order' => $order, 'item' => $item]), $payload)
        ->assertForbidden();
});

function createOrderWithItemFor(User $user, OrderStatus $status): Order
{
    $cart = Cart::factory()->for($user)->create();
    $address = ShippingAddress::factory()->create([
        'cart_id' => $cart->id,
        'user_id' => $user->id,
    ]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'shipping_address_id' => $address->id,
        'status' => $status->value,
    ]);

    $product = Product::factory()->create();
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'color_id' => null,
        'size_id' => null,
        'quantity' => 10,
        'status' => 'active',
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'variant_id' => $variant->id,
        'quantity' => 2,
        'unit_price' => 120,
        'total_price' => 240,
    ]);

    return $order;
}
