<?php

namespace App\Http\Controllers;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\ProductVariant;
use App\Services\CartService;
use App\Services\Payments\AuthorizeNet\AuthorizeNetConfig;
use App\Services\Payments\AuthorizeNet\AuthorizeNetWebhookSignature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Symfony\Component\HttpFoundation\Response;

class PaymentController extends Controller
{
    public function restoreCart(Request $request, string $order, CartService $cartService)
    {
        $orderModel = Order::query()
            ->where('order_number', $order)
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->firstOrFail();

        if ($orderModel->status !== OrderStatus::FAILED) {
            return redirect()
                ->route('cart.index')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'This order is not eligible to restore.',
                ]);
        }

        $cart = $cartService->resolveCart($request);

        DB::transaction(function () use ($orderModel, $cart, $cartService): void {
            foreach ($orderModel->items as $item) {
                if (! $item->variant_id) {
                    continue;
                }

                $variant = ProductVariant::query()->lockForUpdate()->find($item->variant_id);
                if (! $variant) {
                    continue;
                }

                $qty = (int) $item->quantity;
                if ($qty < 1) {
                    continue;
                }

                $targetQty = min($qty, (int) $variant->quantity);
                if ($targetQty < 1) {
                    continue;
                }

                $cartService->addOrMergeLine($cart, $variant, $targetQty);
            }
        });

        return redirect()
            ->route('cart.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Items restored to your cart.',
            ]);
    }

    public function paymentSuccess(Request $request, string $order)
    {
        $orderModel = Order::query()
            ->where('order_number', $order)
            ->where('user_id', $request->user()->id)
            ->with(['items', 'shippingAddress'])
            ->firstOrFail();

        $addr = $orderModel->shippingAddress;

        $sharedProps = [
            'orderNumber' => $orderModel->order_number,
            'orderDate' => $orderModel->created_at?->format('M j, Y'),
            'userEmail' => $request->user()->email,
            'subtotal' => number_format((float) $orderModel->subtotal, 2),
            'shippingCost' => number_format((float) $orderModel->shipping_cost, 2),
            'grandTotal' => number_format((float) $orderModel->grand_total, 2),
            'shippingAddress' => $addr ? [
                'name' => trim($addr->first_name.' '.$addr->last_name),
                'address' => $addr->address,
                'city' => $addr->city,
                'state' => $addr->state,
                'zip_code' => $addr->zip_code,
                'phone' => $addr->phone,
            ] : null,
            'items' => $orderModel->items->map(fn ($item) => [
                'title' => $item->product_title,
                'quantity' => $item->quantity,
                'price' => number_format((float) ($item->offer_price ?? $item->unit_price), 2),
                'image_url' => $item->image_url,
            ])->values(),
        ];

        if ($stripeSessionId = $request->query('session_id')) {
            $gateway = PaymentGateway::query()->where('slug', 'stripe')->first();
            abort_if(! $gateway, 404);

            $result = $gateway->paymentMethod()->confirmPayment((string) $stripeSessionId);

            return Inertia::render('frontend/payment/success', array_merge($sharedProps, [
                'paymentGateway' => 'stripe',
                'success' => (bool) ($result['success'] ?? false),
                'message' => $result['message'] ?? (($result['success'] ?? false) ? 'Payment completed.' : 'Payment not completed.'),
            ]));
        }

        if ($paypalToken = $request->query('token')) {
            $gateway = PaymentGateway::query()->where('slug', 'paypal')->first();
            abort_if(! $gateway, 404);

            $result = $gateway->paymentMethod()->confirmPayment((string) $paypalToken);

            return Inertia::render('frontend/payment/success', array_merge($sharedProps, [
                'paymentGateway' => 'paypal',
                'success' => (bool) ($result['success'] ?? false),
                'message' => $result['message'] ?? (($result['success'] ?? false) ? 'Payment completed.' : 'Payment not completed.'),
            ]));
        }

        $authorizeNetPayment = Payment::query()
            ->where('order_id', $orderModel->id)
            ->where('method', PaymentMethod::AUTHORIZE_NET)
            ->latest('id')
            ->first();

        if ($authorizeNetPayment) {
            $gateway = PaymentGateway::query()->where('slug', 'authorize_net')->first();
            abort_if(! $gateway, 404);

            $paid = $orderModel->payment_status === OrderPaymentStatus::PAID
                && $authorizeNetPayment->status === PaymentStatus::COMPLETED;

            if (! $paid) {
                $gateway->paymentMethod()->confirmPayment($orderModel->order_number);
                $orderModel->refresh();
                $authorizeNetPayment->refresh();
                $paid = $orderModel->payment_status === OrderPaymentStatus::PAID
                    && $authorizeNetPayment->status === PaymentStatus::COMPLETED;
            }

            $message = $paid
                ? __('Payment completed.')
                : __('Your payment is being confirmed. Refresh this page in a moment, or check your email for order updates.');

            return Inertia::render('frontend/payment/success', array_merge($sharedProps, [
                'paymentGateway' => 'authorize_net',
                'success' => $paid,
                'message' => $message,
            ]));
        }

        return redirect()
            ->route('checkout.gateway', ['order' => $orderModel->order_number])
            ->with('toast', [
                'type' => 'error',
                'message' => 'Missing payment confirmation parameters.',
            ]);
    }

    public function paymentFailed(Request $request, string $order)
    {
        $orderModel = Order::query()
            ->where('order_number', $order)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        DB::transaction(function () use ($orderModel) {
            /** @var Order $lockedOrder */
            $lockedOrder = Order::query()->whereKey($orderModel->id)->lockForUpdate()->firstOrFail();

            /** @var Payment|null $payment */
            $payment = Payment::query()
                ->where('order_id', $lockedOrder->id)
                ->where('status', PaymentStatus::PENDING->value)
                ->latest('id')
                ->lockForUpdate()
                ->first();

            if ($payment) {
                $payment->update([
                    'status' => PaymentStatus::CANCELLED->value,
                ]);
            }

            $lockedOrder->update([
                'status' => OrderStatus::FAILED->value,
                'payment_status' => OrderPaymentStatus::UNPAID->value,
            ]);
        });

        return Inertia::render('frontend/payment/failed', [
            'orderNumber' => $orderModel->order_number,
            'message' => 'Payment was cancelled.',
        ]);
    }

    public function stripeWebhook(Request $request): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        $gateway = PaymentGateway::query()->where('slug', 'stripe')->first();
        if (! $gateway) {
            return response('Stripe gateway not configured', 404);
        }

        $secret = (string) ($gateway->getCredential('webhook_secret') ?? config('services.stripe.webhook_secret'));
        if ($secret === '') {
            return response('Stripe webhook secret missing', 400);
        }

        try {
            $event = Webhook::constructEvent($payload, (string) $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return response('Invalid signature', 400);
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload', 400);
        }

        $type = $event->type ?? null;
        $eventId = $event->id ?? null;

        if ($eventId && $this->alreadyProcessedWebhook('stripe', $eventId)) {
            return response('ok', 200);
        }

        if ($type === 'checkout.session.completed') {
            $sessionId = $event->data->object->id ?? null;
            if ($sessionId) {
                try {
                    $gateway->paymentMethod()->confirmPayment((string) $sessionId);
                } catch (\Throwable $t) {
                    Log::warning('Stripe webhook confirm failed', [
                        'session_id' => $sessionId,
                        'error' => $t->getMessage(),
                    ]);
                }
            }
        }

        if ($eventId) {
            $this->markWebhookProcessed('stripe', $eventId);
        }

        return response('ok', 200);
    }

    public function paypalWebhook(Request $request): Response
    {
        $gateway = PaymentGateway::query()->where('slug', 'paypal')->first();
        if (! $gateway) {
            return response('PayPal gateway not configured', 404);
        }

        $webhookId = (string) ($gateway->getCredential('webhook_id') ?? '');
        if ($webhookId === '') {
            return response('PayPal webhook id missing', 400);
        }

        $payload = $request->json()->all();
        $eventId = (string) ($payload['id'] ?? '');

        if ($eventId !== '' && $this->alreadyProcessedWebhook('paypal', $eventId)) {
            return response('ok', 200);
        }

        $verified = $this->verifyPayPalWebhookSignature($request, $gateway, $webhookId);
        if (! $verified) {
            return response('Invalid signature', 400);
        }

        $eventType = (string) ($payload['event_type'] ?? '');
        $resource = $payload['resource'] ?? [];

        // Most useful id we can use to locate local payment is the PayPal Order ID.
        $paypalOrderId = (string) (($resource['id'] ?? '') ?: ($resource['supplementary_data']['related_ids']['order_id'] ?? ''));

        if ($paypalOrderId !== '' && in_array($eventType, [
            'CHECKOUT.ORDER.APPROVED',
            'PAYMENT.CAPTURE.COMPLETED',
        ], true)) {
            try {
                $gateway->paymentMethod()->confirmPayment($paypalOrderId);
            } catch (\Throwable $t) {
                Log::warning('PayPal webhook confirm failed', [
                    'paypal_order_id' => $paypalOrderId,
                    'event_type' => $eventType,
                    'error' => $t->getMessage(),
                ]);
            }
        }

        if ($eventId !== '') {
            $this->markWebhookProcessed('paypal', $eventId);
        }

        return response('ok', 200);
    }

    public function authorizeNetWebhook(Request $request): Response
    {
        $raw = $request->getContent();
        $data = json_decode($raw, true);
        if (! is_array($data)) {
            return response('Invalid JSON', 400);
        }

        $notificationId = (string) ($data['notificationId'] ?? '');
        if ($notificationId === '') {
            return response('Missing notification id', 400);
        }

        if ($this->alreadyProcessedWebhook('authorize_net', $notificationId)) {
            return response('ok', 200);
        }

        $gateway = PaymentGateway::query()->where('slug', 'authorize_net')->first();
        if (! $gateway) {
            return response('Authorize.Net gateway not configured', 404);
        }

        $anetConfig = AuthorizeNetConfig::forGateway($gateway);
        $signatureHeader = $request->header('X-ANET-Signature');
        $skipSignature = app()->environment('testing')
            || (app()->environment('local') && $anetConfig->signatureKey === '');

        if (! $skipSignature) {
            if ($anetConfig->signatureKey === '' || ! AuthorizeNetWebhookSignature::isValid($raw, $signatureHeader, $anetConfig->signatureKey)) {
                return response('Invalid signature', 400);
            }
        }

        $eventType = (string) ($data['eventType'] ?? '');
        $payload = isset($data['payload']) && is_array($data['payload']) ? $data['payload'] : [];

        if ($eventType === 'net.authorize.payment.authcapture.created') {
            try {
                $this->completeAuthorizeNetPaymentFromWebhook($payload);
            } catch (\Throwable $t) {
                Log::warning('Authorize.Net webhook processing failed', [
                    'notification_id' => $notificationId,
                    'error' => $t->getMessage(),
                ]);

                return response('processing failed', 500);
            }
        }

        $this->markWebhookProcessed('authorize_net', $notificationId);

        return response('ok', 200);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function completeAuthorizeNetPaymentFromWebhook(array $payload): void
    {
        $responseCode = (int) ($payload['responseCode'] ?? 0);
        if ($responseCode !== 1) {
            Log::info('Authorize.Net webhook skipped non-approved transaction', [
                'responseCode' => $responseCode,
            ]);

            return;
        }

        $merchantRef = (string) ($payload['merchantReferenceId'] ?? '');
        $paymentDbId = ctype_digit($merchantRef) ? (int) $merchantRef : 0;
        if ($paymentDbId < 1) {
            return;
        }

        $transId = (string) ($payload['id'] ?? '');

        DB::transaction(function () use ($paymentDbId, $transId): void {
            /** @var Payment|null $payment */
            $payment = Payment::query()->whereKey($paymentDbId)->lockForUpdate()->first();
            if (! $payment || $payment->method !== PaymentMethod::AUTHORIZE_NET) {
                return;
            }

            if ($payment->status === PaymentStatus::COMPLETED) {
                return;
            }

            /** @var Order $order */
            $order = Order::query()->whereKey($payment->order_id)->lockForUpdate()->firstOrFail();

            $payment->update([
                'status' => PaymentStatus::COMPLETED->value,
                'paid_at' => now(),
                'gateway_txn_id' => $transId !== '' ? $transId : $payment->gateway_txn_id,
            ]);

            $order->update([
                'status' => OrderStatus::PENDING->value,
                'payment_status' => OrderPaymentStatus::PAID->value,
            ]);
        });
    }

    protected function verifyPayPalWebhookSignature(Request $request, PaymentGateway $gateway, string $webhookId): bool
    {
        $clientId = (string) $gateway->getCredential('client_id');
        $secret = (string) $gateway->getCredential('secret_key');
        if ($clientId === '' || $secret === '') {
            return false;
        }

        $base = $gateway->mode?->value === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $tokenRes = Http::asForm()
            ->withBasicAuth($clientId, $secret)
            ->post($base.'/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
            ]);

        if (! $tokenRes->ok()) {
            Log::warning('PayPal token request failed', ['status' => $tokenRes->status()]);

            return false;
        }

        $accessToken = (string) ($tokenRes->json('access_token') ?? '');
        if ($accessToken === '') {
            return false;
        }

        $body = $request->json()->all();
        $verifyRes = Http::withToken($accessToken)->post($base.'/v1/notifications/verify-webhook-signature', [
            'auth_algo' => $request->header('PAYPAL-AUTH-ALGO'),
            'cert_url' => $request->header('PAYPAL-CERT-URL'),
            'transmission_id' => $request->header('PAYPAL-TRANSMISSION-ID'),
            'transmission_sig' => $request->header('PAYPAL-TRANSMISSION-SIG'),
            'transmission_time' => $request->header('PAYPAL-TRANSMISSION-TIME'),
            'webhook_id' => $webhookId,
            'webhook_event' => $body,
        ]);

        if (! $verifyRes->ok()) {
            Log::warning('PayPal webhook verify failed', ['status' => $verifyRes->status()]);

            return false;
        }

        return (string) ($verifyRes->json('verification_status') ?? '') === 'SUCCESS';
    }

    protected function alreadyProcessedWebhook(string $provider, string $eventId): bool
    {
        return DB::table('payment_webhook_events')
            ->where('provider', $provider)
            ->where('event_id', $eventId)
            ->exists();
    }

    protected function markWebhookProcessed(string $provider, string $eventId): void
    {
        DB::table('payment_webhook_events')->insertOrIgnore([
            'provider' => $provider,
            'event_id' => $eventId,
            'processed_at' => now(),
        ]);
    }
}
