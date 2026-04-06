<?php

namespace App\Http\Controllers;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Payment\PaymentManager;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Symfony\Component\HttpFoundation\Response;

class PaymentController extends Controller
{
    public function paymentSuccess(Request $request, string $order)
    {
        $orderModel = Order::query()
            ->where('order_number', $order)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $stripeSessionId = $request->query('session_id');
        $paypalToken = $request->query('token');

        if ($stripeSessionId) {
            $gateway = PaymentGateway::query()->where('slug', 'stripe')->first();
            abort_if(! $gateway, 404);

            $result = $gateway->paymentMethod()->confirmPayment((string) $stripeSessionId);

            return redirect()
                ->route('cart.index')
                ->with('toast', [
                    'type' => ($result['success'] ?? false) ? 'success' : 'error',
                    'message' => $result['message'] ?? (($result['success'] ?? false) ? 'Payment completed.' : 'Payment not completed.'),
                ]);
        }

        if ($paypalToken) {
            $gateway = PaymentGateway::query()->where('slug', 'paypal')->first();
            abort_if(! $gateway, 404);

            $result = $gateway->paymentMethod()->confirmPayment((string) $paypalToken);

            return redirect()
                ->route('cart.index')
                ->with('toast', [
                    'type' => ($result['success'] ?? false) ? 'success' : 'error',
                    'message' => $result['message'] ?? (($result['success'] ?? false) ? 'Payment completed.' : 'Payment not completed.'),
                ]);
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

        return redirect()
            ->route('checkout.gateway', ['order' => $orderModel->order_number])
            ->with('toast', [
                'type' => 'error',
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

