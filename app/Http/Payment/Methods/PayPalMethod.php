<?php

namespace App\Http\Payment\Methods;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Payment\PaymentMethod;
use App\Models\Order;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalMethod extends PaymentMethod
{
    protected $id = 'paypal';

    protected $name = 'PayPal';

    protected $requiresFrontendJs = false;

    protected function baseUrl(): string
    {
        $mode = $this->gateway?->mode?->value ?? 'sandbox';

        return $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    protected function getAccessToken(): string
    {
        $clientId = (string) $this->gateway?->getCredential('client_id');
        $secret = (string) $this->gateway?->getCredential('secret_key');

        if ($clientId === '' || $secret === '') {
            throw new Exception('PayPal credentials missing.');
        }

        $cacheKey = 'paypal.access_token.'.sha1($clientId);
        $cached = Cache::get($cacheKey);
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        $res = Http::asForm()
            ->withBasicAuth($clientId, $secret)
            ->post($this->baseUrl().'/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
            ]);

        if (! $res->ok()) {
            throw new Exception('PayPal token request failed.');
        }

        $token = (string) ($res->json('access_token') ?? '');
        $expiresIn = (int) ($res->json('expires_in') ?? 0);
        if ($token === '' || $expiresIn < 30) {
            throw new Exception('PayPal token response invalid.');
        }

        Cache::put($cacheKey, $token, now()->addSeconds(max(60, $expiresIn - 30)));

        return $token;
    }

    public function startPayment(Order $order, array $paymentData = []): array
    {
        try {
            /** @var Payment|null $payment */
            $payment = $paymentData['payment'] ?? null;
            if (! $payment instanceof Payment) {
                throw new Exception('Missing payment context.');
            }

            $successUrl = $paymentData['success_url'] ?? route('payment.success', ['order' => $order->order_number]);
            $cancelUrl = $paymentData['cancel_url'] ?? route('payment.cancel', ['order' => $order->order_number]);

            $token = $this->getAccessToken();

            $res = Http::withToken($token)
                ->acceptJson()
                ->withHeaders([
                    // PayPal idempotency header (recommended by docs)
                    'PayPal-Request-Id' => 'order-'.$order->order_number.'-payment-'.$payment->id,
                ])
                ->post($this->baseUrl().'/v2/checkout/orders', [
                    'intent' => 'CAPTURE',
                    'purchase_units' => [
                        [
                            'reference_id' => $order->order_number,
                            'amount' => [
                                'currency_code' => 'USD',
                                'value' => (string) $payment->amount,
                            ],
                        ],
                    ],
                    'application_context' => [
                        'brand_name' => config('app.name'),
                        'user_action' => 'PAY_NOW',
                        'return_url' => $successUrl,
                        'cancel_url' => $cancelUrl,
                    ],
                ]);

            if (! $res->successful()) {
                Log::warning('PayPal order create request failed', [
                    'order_number' => $order->order_number,
                    'status' => $res->status(),
                    'body' => $res->json() ?: $res->body(),
                ]);

                throw new Exception('PayPal order create failed.');
            }

            $paypalOrderId = (string) ($res->json('id') ?? '');
            if ($paypalOrderId === '') {
                throw new Exception('PayPal order id missing.');
            }

            $approveUrl = null;
            foreach (($res->json('links') ?? []) as $link) {
                if (($link['rel'] ?? null) === 'approve') {
                    $approveUrl = $link['href'] ?? null;
                    break;
                }
            }

            if (! is_string($approveUrl) || $approveUrl === '') {
                throw new Exception('PayPal approve URL not found.');
            }

            $payment->update([
                'gateway_txn_id' => $paypalOrderId,
                'gateway_response' => json_encode([
                    'paypal_order_id' => $paypalOrderId,
                    'checkout_url' => $approveUrl,
                ], JSON_THROW_ON_ERROR),
            ]);

            return [
                'success' => true,
                'checkout_url' => $approveUrl,
                'gateway_order_id' => $paypalOrderId,
                'message' => __('Redirecting to PayPal Checkout...'),
            ];
        } catch (Exception $e) {
            Log::error('PayPal payment initialization failed', [
                'order_number' => $order->order_number ?? null,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Failed to initialize PayPal payment: :message', ['message' => $e->getMessage()]),
            ];
        }
    }

    public function confirmPayment(string $transactionId, ?string $paymentMethodId = null): array
    {
        try {
            $token = $this->getAccessToken();
            $res = Http::withToken($token)->post($this->baseUrl()."/v2/checkout/orders/{$transactionId}/capture");

            if (! $res->successful()) {
                throw new Exception('PayPal capture failed.');
            }

            $status = strtoupper((string) ($res->json('status') ?? ''));
            if ($status !== 'COMPLETED') {
                return [
                    'success' => false,
                    'message' => __('Payment not completed. Status: :status', ['status' => $status ?: 'unknown']),
                ];
            }

            return DB::transaction(function () use ($transactionId) {
                /** @var Payment $payment */
                $payment = Payment::query()
                    ->where('method', 'paypal')
                    ->where('gateway_txn_id', $transactionId)
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
            Log::error('PayPal payment confirmation failed', [
                'paypal_order_id' => $transactionId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Payment confirmation failed: :message', ['message' => $e->getMessage()]),
            ];
        }
    }
}