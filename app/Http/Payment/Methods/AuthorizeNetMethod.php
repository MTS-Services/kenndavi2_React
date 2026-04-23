<?php

namespace App\Http\Payment\Methods;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Payment\PaymentMethod;
use App\Models\Order;
use App\Models\Payment;
use App\Services\Payments\AuthorizeNet\AcceptHostedTokenService;
use App\Services\Payments\AuthorizeNet\AuthorizeNetConfig;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use net\authorize\api\contract\v1\GetUnsettledTransactionListRequest;
use net\authorize\api\contract\v1\GetUnsettledTransactionListResponse;
use net\authorize\api\contract\v1\MerchantAuthenticationType;
use net\authorize\api\controller\GetUnsettledTransactionListController;

class AuthorizeNetMethod extends PaymentMethod
{
    protected $id = 'authorize_net';

    protected $name = 'Authorize.Net';

    protected $requiresFrontendJs = false;

    public function startPayment(Order $order, array $paymentData = []): array
    {
        try {
            /** @var Payment|null $payment */
            $payment = $paymentData['payment'] ?? null;
            if (! $payment instanceof Payment) {
                throw new Exception('Missing payment context.');
            }

            $config = AuthorizeNetConfig::forGateway($this->gateway);

            $baseUrl = $this->resolveAuthorizeNetBaseUrl();
            $successUrl = (string) ($paymentData['success_url']
                ?? ($baseUrl.route('payment.success', ['order' => $order->order_number], false)));
            $cancelUrl = (string) ($paymentData['cancel_url']
                ?? ($baseUrl.route('payment.cancel', ['order' => $order->order_number], false)));

            if (! Str::startsWith($successUrl, ['http://', 'https://'])) {
                throw new Exception('Invalid success URL generated for Authorize.Net.');
            }

            if (! Str::startsWith($cancelUrl, ['http://', 'https://'])) {
                throw new Exception('Invalid cancel URL generated for Authorize.Net.');
            }

            $hosted = app(AcceptHostedTokenService::class)->requestHostedFormToken(
                $config,
                $order,
                $payment,
                $successUrl,
                $cancelUrl,
            );

            $relayUrl = URL::temporarySignedRoute(
                'payment.authorize-net.relay',
                now()->addMinutes(14),
                ['payment' => $payment->id],
            );

            $gatewayPayload = [
                'accept_hosted_token' => $hosted['token'],
                'accept_hosted_post_url' => $hosted['post_url'],
                'relay_url' => $relayUrl,
            ];

            $payment->update([
                'gateway_txn_id' => null,
                'gateway_response' => json_encode($gatewayPayload, JSON_THROW_ON_ERROR),
            ]);

            return [
                'success' => true,
                'checkout_url' => $relayUrl,
                'message' => __('Redirecting to payment…'),
            ];
        } catch (Exception $e) {
            Log::error('Authorize.Net payment initialization failed', [
                'order_number' => $order->order_number ?? null,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Failed to initialize payment: :message', ['message' => $e->getMessage()]),
            ];
        }
    }

    public function confirmPayment(string $orderNumber, ?string $paymentMethodId = null): array
    {
        try {
            $config = AuthorizeNetConfig::forGateway($this->gateway);
            if (! $config->configured()) {
                throw new Exception('Authorize.Net API credentials are not configured.');
            }

            /** @var Payment|null $existing */
            $existing = Payment::query()
                ->where('method', 'authorize_net')
                ->whereHas('order', fn ($q) => $q->where('order_number', $orderNumber))
                ->latest('id')
                ->first();

            if ($existing?->status === PaymentStatus::COMPLETED) {
                return ['success' => true, 'message' => __('Payment already processed.')];
            }

            $merchantAuth = new MerchantAuthenticationType;
            $merchantAuth->setName($config->loginId);
            $merchantAuth->setTransactionKey($config->transactionKey);

            $request = new GetUnsettledTransactionListRequest;
            $request->setMerchantAuthentication($merchantAuth);

            $controller = new GetUnsettledTransactionListController($request);
            /** @var GetUnsettledTransactionListResponse|null $response */
            $response = $controller->executeWithApiResponse($config->apiEndpoint());
            if ($response === null || $response->getMessages()?->getResultCode() !== 'Ok') {
                return ['success' => false, 'message' => __('Unable to verify payment yet.')];
            }

            $matchedTxn = null;
            foreach ($response->getTransactions() ?? [] as $txn) {
                if ((string) $txn->getInvoiceNumber() === $orderNumber) {
                    $matchedTxn = $txn;
                    break;
                }
            }

            if (! $matchedTxn) {
                return ['success' => false, 'message' => __('Payment is still processing.')];
            }

            DB::transaction(function () use ($orderNumber, $matchedTxn): void {
                /** @var Payment $payment */
                $payment = Payment::query()
                    ->where('method', 'authorize_net')
                    ->whereHas('order', fn ($q) => $q->where('order_number', $orderNumber))
                    ->lockForUpdate()
                    ->latest('id')
                    ->firstOrFail();

                if ($payment->status !== PaymentStatus::COMPLETED) {
                    $payment->update([
                        'status' => PaymentStatus::COMPLETED->value,
                        'paid_at' => now(),
                        'gateway_txn_id' => (string) $matchedTxn->getTransId(),
                    ]);
                }

                /** @var Order $order */
                $order = Order::query()->whereKey($payment->order_id)->lockForUpdate()->firstOrFail();
                $order->update([
                    'status' => OrderStatus::PENDING->value,
                    'payment_status' => OrderPaymentStatus::PAID->value,
                ]);
            });

            return ['success' => true, 'message' => __('Payment confirmed.')];
        } catch (Exception $e) {
            Log::warning('Authorize.Net payment confirmation fallback failed', [
                'order_number' => $orderNumber,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'message' => __('Payment is still processing.')];
        }
    }

    private function resolveAuthorizeNetBaseUrl(): string
    {
        $configured = rtrim((string) config('services.authorize_net.public_base_url', config('app.url')), '/');
        if ($configured === '') {
            throw new Exception('Missing base URL for Authorize.Net return/cancel routes.');
        }

        $parts = parse_url($configured);
        $host = strtolower((string) ($parts['host'] ?? ''));
        if ($host === 'localhost') {
            $scheme = (string) ($parts['scheme'] ?? 'http');
            $port = isset($parts['port']) ? ':'.$parts['port'] : '';

            return "{$scheme}://127.0.0.1{$port}";
        }

        return $configured;
    }
}
