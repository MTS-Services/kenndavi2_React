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
            $shippingAddress = ShippingAddress::factory()->create(['user_id' => $user->id]);

            Order::factory(rand(1, 3))->create([
                'user_id' => $user->id,
                'shipping_address_id' => $shippingAddress->id,
            ])->each(function ($order) use ($user, $admins, $variants) {
                $orderVariants = $variants->random(rand(1, 4));
                $subtotal = 0;
                $items = [];

                foreach ($orderVariants as $variant) {
                    $quantity = rand(1, 3);
                    $price = $variant->price;
                    $total = $price * $quantity;
                    $subtotal += $total;

                    $items[] = OrderItem::create([
                        'order_id' => $order->id,
                        'variant_id' => $variant->id,
                        'product_title' => $variant->product->title,
                        'sku' => Str::limit($variant->product->slug, 50).'-'.$variant->color->name.'-'.$variant->size->name,
                        'color_name' => $variant->color->name,
                        'size_name' => $variant->size->name,
                        'image_url' => 'https://placehold.co/100x125?text='.urlencode($variant->product->title),
                        'unit_price' => $price,
                        'quantity' => $quantity,
                        'total_price' => $total,
                    ]);
                }

                $order->update([
                    'order_number' => 'ORD-'.strtoupper(Str::random(8)),
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
                        'gateway_txn_id' => 'txn_'.Str::random(10),
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
                            if (rand(0, 1)) {
                                ProductReview::create([
                                    'product_id' => $item->variant->product_id,
                                    'user_id' => $user->id,
                                    'order_item_id' => $item->id,
                                    'rating' => rand(3, 5),
                                    'title' => 'Great product!',
                                    'comment' => 'I really liked this product, it works as expected.',
                                    'is_verified' => true,
                                    'status' => ReviewStatus::PUBLISHED,
                                ]);
                            }
                        }
                    }

                    // Refunds for some orders
                    if ($order->status === OrderStatus::CANCELLED && rand(0, 1)) {
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
            });
        });
    }
}
