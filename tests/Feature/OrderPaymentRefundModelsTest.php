<?php

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentTransactionStatus;
use App\Enums\RefundReason;
use App\Enums\RefundStatus;
use App\Models\Admin;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Models\ProductVariant;
use App\Models\Refund;
use App\Models\ShippingAddress;
use App\Models\User;

it('creates order graph with items, payments, transactions and refunds', function () {
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
    $variant = ProductVariant::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'shipping_address_id' => $address->id,
        'status' => OrderStatus::PENDING->value,
        'payment_status' => OrderPaymentStatus::UNPAID->value,
    ]);

    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'variant_id' => $variant->id,
        'product_title' => $variant->product->title,
    ]);

    $payment = Payment::factory()->create([
        'order_id' => $order->id,
        'status' => PaymentStatus::COMPLETED->value,
    ]);

    $transaction = PaymentTransaction::factory()->create([
        'payment_id' => $payment->id,
        'order_id' => $order->id,
        'status' => PaymentTransactionStatus::SUCCESS->value,
    ]);

    $admin = Admin::factory()->create();

    $refund = Refund::factory()->create([
        'order_id' => $order->id,
        'order_item_id' => $item->id,
        'payment_transaction_id' => $transaction->id,
        'reason' => RefundReason::CUSTOMER_REQUEST->value,
        'status' => RefundStatus::APPROVED->value,
        'refunded_by' => $admin->id,
    ]);

    $order->refresh();
    $payment->refresh();
    $transaction->refresh();
    $refund->refresh();

    expect($order->status)->toBeInstanceOf(OrderStatus::class)
        ->and($order->payment_status)->toBeInstanceOf(OrderPaymentStatus::class)
        ->and($order->items)->toHaveCount(1)
        ->and($order->payments)->toHaveCount(1)
        ->and($order->paymentTransactions)->toHaveCount(1)
        ->and($order->refunds)->toHaveCount(1)
        ->and($payment->status)->toBeInstanceOf(PaymentStatus::class)
        ->and($transaction->status)->toBeInstanceOf(PaymentTransactionStatus::class)
        ->and($refund->reason)->toBeInstanceOf(RefundReason::class)
        ->and($refund->status)->toBeInstanceOf(RefundStatus::class)
        ->and($refund->order->is($order))->toBeTrue()
        ->and($refund->orderItem->is($item))->toBeTrue()
        ->and($refund->paymentTransaction->is($transaction))->toBeTrue();
});

it('stores order status history with polymorphic changer', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::PENDING->value,
    ]);

    $history = OrderStatusHistory::factory()->create([
        'order_id' => $order->id,
        'changer_id' => $user->id,
        'changer_type' => User::class,
        'from_status' => OrderStatus::PENDING->value,
        'to_status' => OrderStatus::CONFIRMED->value,
    ]);

    $order->refresh();

    expect($order->statusHistory)->toHaveCount(1)
        ->and($history->order->is($order))->toBeTrue()
        ->and($history->changer->is($user))->toBeTrue();
});
