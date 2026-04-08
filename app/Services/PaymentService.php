<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Payment\PaymentManager;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function __construct(
        protected PaymentManager $paymentManager
    ) {}

    /**
     * Start a direct checkout payment for an order.
     */
    public function processPayment(Order $order, string $gateway, array $paymentData = []): array
    {
        try {
            if (!$this->canProcessPayment($order)) {
                return [
                    'success' => false,
                    'message' => 'Order cannot accept payment at this time.',
                    'reason' => 'invalid_order_status',
                ];
            }

            $paymentGateway = PaymentGateway::where('slug', $gateway)
                ->where('is_active', true)
                ->first();

            if (! $paymentGateway || ! $paymentGateway->isSupported()) {
                return [
                    'success' => false,
                    'message' => 'Payment gateway not available.',
                    'reason' => 'gateway_unavailable',
                ];
            }

            $paymentMethod = $paymentGateway->paymentMethod();

            return DB::transaction(function () use ($order, $gateway, $paymentData, $paymentMethod) {
                /** @var Order $lockedOrder */
                $lockedOrder = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

                $payment = Payment::query()
                    ->where('order_id', $lockedOrder->id)
                    ->where('method', $gateway)
                    ->where('status', PaymentStatus::PENDING->value)
                    ->latest('id')
                    ->first();

                if (! $payment) {
                    $payment = Payment::create([
                        'order_id' => $lockedOrder->id,
                        'method' => $gateway,
                        'gateway_txn_id' => null,
                        'txn_id' => generate_transaction_id_hybrid(),
                        'amount' => $lockedOrder->grand_total,
                        'currency' => 'USD',
                        'status' => PaymentStatus::PENDING->value,
                        'paid_at' => null,
                        'gateway_response' => null,
                    ]);
                }

                return $paymentMethod->startPayment($lockedOrder, array_merge($paymentData, [
                    'payment' => $payment,
                ]));
            });
        } catch (Exception $e) {
            Log::error('Payment processing failed', [
                'order_number' => $order->order_number,
                'gateway' => $gateway,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Payment processing failed: ' . $e->getMessage(),
                'reason' => 'exception',
            ];
        }
    }

    protected function canProcessPayment(Order $order): bool
    {
        if (! in_array($order->status?->value, [
            OrderStatus::INITIALIZED->value,
            OrderStatus::PENDING->value,
            OrderStatus::FAILED->value,
        ], true)) {
            Log::warning('Order cannot accept payment', [
                'order_number' => $order->order_number,
                'status' => $order->status?->value,
            ]);

            return false;
        }

        return true;
    }
}
