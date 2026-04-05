<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Http\Payment\PaymentManager;
use App\Models\Order;
use App\Models\PaymentGateway;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class PaymentService
{
    public function __construct(
        protected PaymentManager $paymentManager
    ) {}

    /**
     * Process a regular payment (original flow - unchanged)
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

            return $paymentMethod->startPayment($order, $paymentData);
        } catch (Exception $e) {
            Log::error('Payment processing failed', [
                'order_id' => $order->order_id,
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

    /**
     * Process top-up and then payment (for insufficient wallet balance)
     * This stores order info in session and redirects to payment gateway
     */
    public function processTopUpAndPayment(Order $order, string $topUpGateway, float $topUpAmount, array $paymentData = []): array
    {
        try {
            if (! $this->canProcessPayment($order)) {
                return [
                    'success' => false,
                    'message' => 'Order cannot accept payment at this time.',
                ];
            }

            $paymentGateway = PaymentGateway::where('slug', $topUpGateway)
                ->where('is_active', true)
                ->first();

            if (! $paymentGateway || ! $paymentGateway->isSupported()) {
                return [
                    'success' => false,
                    'message' => 'Selected payment gateway is not available.',
                ];
            }

            $paymentMethod = $paymentGateway->paymentMethod();

            // Store top-up information in session for later processing
            $topUpData = [
                'order_id' => $order->id,
                'order_number' => $order->order_id,
                'top_up_amount' => $topUpAmount,
                'order_total' => $paymentData['grand_total'] ?? $order->grand_total,
                'order_total_default' => $paymentData['grand_total_default'] ?? $order->default_grand_total,
                'top_up_gateway' => $topUpGateway,
                'created_at' => now()->timestamp,
                'expires_at' => now()->addMinutes(30)->timestamp,
            ];

            // Store in session with order-specific key
            Session::put("topup_order_{$order->order_id}", $topUpData);

            Log::info('Top-up session created', [
                'order_id' => $order->order_id,
                'top_up_amount' => $topUpAmount,
                'gateway' => $topUpGateway,
            ]);

            // Start payment with the payment gateway
            // Pass flag to indicate this is a top-up payment
            $result = $paymentMethod->startPayment($order, array_merge($paymentData, [
                'is_topup' => true,
                'top_up_amount' => $topUpAmount,
            ]));

            if ($result['success']) {
                Log::info('Top-up payment initiated', [
                    'order_id' => $order->order_id,
                    'top_up_amount' => $topUpAmount,
                    'gateway' => $topUpGateway,
                ]);
            }

            return $result;
        } catch (Exception $e) {
            Log::error('Top-up payment processing failed', [
                'order_id' => $order->order_id,
                'top_up_amount' => $topUpAmount,
                'gateway' => $topUpGateway,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Top-up payment failed: ' . $e->getMessage(),
            ];
        }
    }

    protected function canProcessPayment(Order $order): bool
    {
        if (! in_array($order->status, [
            OrderStatus::INITIALIZED,
            OrderStatus::PENDING,
            OrderStatus::FAILED,
        ])) {
            Log::warning('Order cannot accept payment', [
                'order_id' => $order->order_id,
                'status' => $order->status->value,
            ]);

            return false;
        }

        if (method_exists($order, 'isFullyPaid') && $order->isFullyPaid()) {
            Log::warning('Order already fully paid', [
                'order_id' => $order->order_id,
            ]);

            return false;
        }

        return true;
    }
}
