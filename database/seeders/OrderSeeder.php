<?php

namespace Database\Seeders;

use App\Enums\CurrencyCode;
use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\PaymentTransactionStatus;
use App\Enums\RefundReason;
use App\Enums\RefundStatus;
use App\Enums\ReviewStatus;
use App\Models\Admin;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Models\ProductReview;
use App\Models\ProductVariant;
use App\Models\Refund;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $admins = Admin::all();
        $variants = ProductVariant::with(['product', 'color', 'size'])->get();

        if ($users->isEmpty()) {
            $this->call(UserSeeder::class);
            $users = User::all();
        }

        if ($admins->isEmpty()) {
            $this->call(AdminSeeder::class);
            $admins = Admin::all();
        }

        if ($variants->isEmpty()) {
            $this->call(ProductSeeder::class);
            $variants = ProductVariant::with(['product', 'color', 'size'])->get();
        }

        $users->each(function ($user) use ($admins, $variants) {
            $cart = Cart::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'session_id' => 'seed-' . substr(md5((string) $user->email), 0, 12),
                    'expires_at' => now()->addDays(30),
                ]
            );

            $shippingAddress = ShippingAddress::updateOrCreate(
                ['cart_id' => $cart->id, 'user_id' => $user->id],
                [
                    'cart_id' => $cart->id,
                    'user_id' => $user->id,
                    'first_name' => $user->first_name ?? 'Customer',
                    'last_name' => $user->last_name ?? null,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '+1 555 0100',
                    'state' => $user->state ?? 'California',
                    'city' => $user->city ?? 'Los Angeles',
                    'zip_code' => $user->zip_code ?? '90001',
                    'address' => $user->address_line ?? '100 Market Street',
                ]
            );

            $orderCount = min(2, max(1, ($user->id % 2) + 1));
            for ($orderIndex = 0; $orderIndex < $orderCount; $orderIndex++) {
                $status = match (($user->id + $orderIndex) % 4) {
                    0 => OrderStatus::PENDING->value,
                    1 => OrderStatus::PROCESSING->value,
                    2 => OrderStatus::COMPLETED->value,
                    default => OrderStatus::CANCELLED->value,
                };

                $paymentStatus = in_array($status, [OrderStatus::COMPLETED->value, OrderStatus::PROCESSING->value], true)
                    ? OrderPaymentStatus::PAID
                    : OrderPaymentStatus::UNPAID;

                $orderNumber = generate_order_id_hybrid();
                $order = Order::updateOrCreate(
                    ['order_number' => $orderNumber],
                    [
                        'order_number' => $orderNumber,
                        'user_id' => $user->id,
                        'shipping_address_id' => $shippingAddress->id,
                        'subtotal' => 0,
                        'discount_amount' => 0,
                        'shipping_cost' => 10,
                        'tax_amount' => 5,
                        'grand_total' => 0,
                        'status' => $status,
                        'payment_status' => $paymentStatus->value,
                        'notes' => $status === OrderStatus::CANCELLED->value ? 'Cancelled by customer request.' : null,
                    ]
                );

                // Make this seeder re-runnable: clear existing dependent rows for this order.
                $existingItemIds = OrderItem::query()->where('order_id', $order->id)->pluck('id');
                if ($existingItemIds->isNotEmpty()) {
                    ProductReview::query()->whereIn('order_item_id', $existingItemIds)->delete();
                }
                Refund::query()->where('order_id', $order->id)->delete();
                PaymentTransaction::query()->where('order_id', $order->id)->delete();
                Payment::query()->where('order_id', $order->id)->delete();
                OrderStatusHistory::query()->where('order_id', $order->id)->delete();
                OrderItem::query()->where('order_id', $order->id)->delete();

                $orderVariants = $variants->random(rand(1, 4));
                $subtotal = 0;
                $items = [];

                foreach ($orderVariants as $variant) {
                    $quantity = rand(1, 3);
                    $price = $variant->product->price ?? 0;
                    $total = $price * $quantity;
                    $subtotal += $total;

                    $items[] = OrderItem::create([
                        'order_id' => $order->id,
                        'variant_id' => $variant->id,
                        'product_title' => $variant->product->title,
                        'sku' => Str::limit($variant->product->slug, 50).'-'.$variant->color->name.'-'.$variant->size->name,
                        'color_name' => $variant->color->name,
                        'size_name' => $variant->size->name,
                        'image_url' => 'https://picsum.photos/seed/order-item-' . urlencode($variant->product->slug) . '/100/125',
                        'unit_price' => $price,
                        'quantity' => $quantity,
                        'total_price' => $total,
                    ]);
                }

                $order->update([
                    'subtotal' => $subtotal,
                    'grand_total' => $subtotal + $order->shipping_cost + $order->tax_amount - $order->discount_amount,
                ]);

                // Order Status History
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'changer_id' => $user->id,
                    'changer_type' => User::class,
                    'from_status' => null,
                    'to_status' => $order->status,
                    'note' => 'Order created.',
                ]);

                // Payment
                if ($order->payment_status === OrderPaymentStatus::PAID) {
                    $payment = Payment::create([
                        'order_id' => $order->id,
                        'method' => PaymentMethod::CARD,
                        'gateway_txn_id' => 'txn_' . substr(md5($order->order_number), 0, 10),
                        'txn_id' => generate_transaction_id_hybrid(),
                        'amount' => $order->grand_total,
                        'currency' => CurrencyCode::USD,
                        'status' => PaymentStatus::COMPLETED,
                        'paid_at' => now(),
                    ]);

                    $transaction = PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'order_id' => $order->id,
                        'type' => 'capture',
                        'gateway_txn_id' => $payment->gateway_txn_id,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'status' => PaymentTransactionStatus::SUCCESS,
                        'initiated_at' => now(),
                        'completed_at' => now(),
                    ]);

                    // Reviews for paid orders
                    if ($order->status === OrderStatus::COMPLETED) {
                        foreach ($items as $item) {
                            if (($item->id % 2) === 0) {
                                ProductReview::create([
                                    'product_id' => $item->variant->product_id,
                                    'user_id' => $user->id,
                                    'order_item_id' => $item->id,
                                    'rating' => 5,
                                    'title' => 'Exactly as described',
                                    'comment' => 'Good quality and arrived on time. Sizing and color matched the photos.',
                                    'is_verified' => true,
                                    'status' => ReviewStatus::PUBLISHED,
                                ]);
                            }
                        }
                    }

                    // Refunds for some orders
                    if ($order->status === OrderStatus::CANCELLED->value && (($order->id % 2) === 1)) {
                        Refund::create([
                            'order_id' => $order->id,
                            'order_item_id' => $items[0]->id,
                            'payment_transaction_id' => $transaction->id,
                            'amount' => $items[0]->total_price,
                            'reason' => RefundReason::CUSTOMER_REQUEST,
                            'status' => RefundStatus::COMPLETED,
                            'refunded_by' => $admins->random()->id,
                            'processed_at' => now(),
                        ]);
                    }
                }
            }
        });
    }
}
