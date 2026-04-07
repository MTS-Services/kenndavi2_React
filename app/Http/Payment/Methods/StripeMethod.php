<?php

namespace App\Http\Payment\Methods;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Payment\PaymentMethod;
use App\Models\Order;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class StripeMethod extends PaymentMethod
{
    protected $id = 'stripe';

    protected $name = 'Stripe';

    protected $requiresFrontendJs = false;

    public function __construct($gateway)
    {
        parent::__construct($gateway);

        $secretKey = $this->gateway?->getCredential('secret_key') ?? config('services.stripe.secret');
        Stripe::setApiKey($secretKey);
    }

    public function startPayment(Order $order, array $paymentData = []): array
    {
        try {
            /** @var Payment|null $payment */
            $payment = $paymentData['payment'] ?? null;
            if (! $payment instanceof Payment) {
                throw new Exception('Missing payment context.');
            }

            $currency = 'usd';

            $successUrl = $paymentData['success_url']
                ?? route('payment.success', ['order' => $order->order_number]).'?session_id={CHECKOUT_SESSION_ID}';
            $cancelUrl = $paymentData['cancel_url']
                ?? route('payment.cancel', ['order' => $order->order_number]);

            $session = StripeSession::create([
                'mode' => 'payment',
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => $currency,
                            'product_data' => [
                                'name' => sprintf('%s - Order %s', config('app.name'), $order->order_number),
                            ],
                            'unit_amount' => (int) round(((float) $payment->amount) * 100),
                        ],
                        'quantity' => 1,
                    ],
                ],
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
                'metadata' => [
                    'order_number' => $order->order_number,
                    'payment_db_id' => (string) $payment->id,
                ],
                'client_reference_id' => (string) $order->order_number,
            ]);

            $payment->update([
                'gateway_txn_id' => $session->id,
                'gateway_response' => json_encode([
                    'stripe_session_id' => $session->id,
                    'checkout_url' => $session->url,
                ], JSON_THROW_ON_ERROR),
            ]);

            return [
                'success' => true,
                'checkout_url' => $session->url,
                'session_id' => $session->id,
                'message' => __('Redirecting to Stripe Checkout...'),
            ];
        } catch (Exception $e) {
            Log::error('Stripe payment initialization failed', [
                'order_number' => $order->order_number ?? null,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Failed to initialize Stripe payment: :message', ['message' => $e->getMessage()]),
            ];
        }
    }

    public function confirmPayment(string $sessionId, ?string $paymentMethodId = null): array
    {
        try {
            $session = StripeSession::retrieve($sessionId);
            if (! $session) {
                throw new Exception('Stripe session not found.');
            }

            if (($session->payment_status ?? null) !== 'paid') {
                return [
                    'success' => false,
                    'message' => __('Payment not completed.'),
                ];
            }

            return DB::transaction(function () use ($sessionId) {
                /** @var Payment $payment */
                $payment = Payment::query()
                    ->where('method', 'stripe')
                    ->where('gateway_txn_id', $sessionId)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($payment->status?->value === PaymentStatus::COMPLETED->value) {
                    return [
                        'success' => true,
                        'message' => __('Payment already processed.'),
                    ];
                }

                /** @var Order $order */
                $order = Order::query()->whereKey($payment->order_id)->lockForUpdate()->firstOrFail();

                $payment->update([
                    'status' => PaymentStatus::COMPLETED->value,
                    'paid_at' => now(),
                ]);

                $order->update([
                    'status' => OrderStatus::PENDING->value,
                    'payment_status' => OrderPaymentStatus::PAID->value,
                ]);

                return [
                    'success' => true,
                    'message' => __('Payment confirmed.'),
                ];
            });
        } catch (Exception $e) {
            Log::error('Stripe payment confirmation failed', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Payment confirmation failed: :message', ['message' => $e->getMessage()]),
            ];
        }
    }
}

