<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Payment success page.
     *
     * Query param detection (mirrors each gateway's pattern):
     *
     *  Gateway       | Param            | Example
     *  --------------|------------------|------------------------------------------
     *  Stripe        | session_id       | ?session_id=cs_test_xxx&order_id=ORD-xxx
     *  NowPayments   | NP_id            | ?NP_id=xxx&order_id=ORD-xxx
     *  Tebex         | basket_ident     | ?basket_ident=abc123&order_id=ORD-xxx  ← NEW
     */
    public function paymentSuccess(Request $request)
    {
        $orderId = $request->query('order_id');
        $sessionId = $request->query('session_id');    // Stripe
        $invoiceId = $request->query('NP_id');          // NowPayments (Crypto)
        $basketIdent = $request->query('basket_ident');   // Tebex ← like session_id / NP_i

        Log::info('Payment success page', [
            'order_id' => $orderId,
            'session_id' => $sessionId,
            'invoice_id' => $invoiceId,
            'basket_ident' => $basketIdent,
        ]);

        // ── STRIPE confirmation ───────────────────────────────────────────────
        if ($sessionId) {
            $gateway = PaymentGateway::where('slug', 'stripe')->first();

            if ($gateway) {
                try {
                    $result = $gateway->paymentMethod()->confirmPayment($sessionId);

                    if (! $result['success']) {
                        Log::warning('Stripe payment confirmation failed on success page', [
                            'session_id' => $sessionId,
                            'order_id' => $orderId,
                            'result' => $result,
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Error confirming Stripe payment on success page', [
                        'session_id' => $sessionId,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        // ── NOWPAYMENTS (Crypto) confirmation ─────────────────────────────────
        if ($invoiceId) {
            $gateway = PaymentGateway::where('slug', 'crypto')->first();

            if ($gateway) {
                try {
                    $result = $gateway->paymentMethod()->confirmPayment($invoiceId);

                    Log::info('Crypto payment confirmation result', [
                        'invoice_id' => $invoiceId,
                        'order_id' => $orderId,
                        'result' => $result,
                    ]);

                    if (! $result['success']) {
                        return view('user.payment.pending', [
                            'order_id' => $orderId,
                            'message' => $result['message'] ?? __('Payment is being processed'),
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Error confirming crypto payment', [
                        'invoice_id' => $invoiceId,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
            }
        }

        // ── TEBEX confirmation ────────────────────────────────────────────────
        // basket_ident is injected into the complete_url in TebexMethod::startPayment()
        // (STEP 2 — basket patch), exactly like Stripe's {CHECKOUT_SESSION_ID}.
        if ($basketIdent) {
            $gateway = PaymentGateway::where('slug', 'tebex')->first();

            if ($gateway) {
                try {
                    $result = $gateway->paymentMethod()->confirmPayment($basketIdent);

                    Log::info('Tebex payment confirmation result', [
                        'basket_ident' => $basketIdent,
                        'order_id' => $orderId,
                        'result' => $result,
                    ]);

                    if (! $result['success']) {
                        Log::warning('Tebex payment confirmation failed on success page', [
                            'basket_ident' => $basketIdent,
                            'order_id' => $orderId,
                            'message' => $result['message'] ?? 'Unknown error',
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Error confirming Tebex payment on success page', [
                        'basket_ident' => $basketIdent,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
            }
        }

        // ── Load order and redirect ───────────────────────────────────────────
        $order = Order::where('order_id', $orderId)
            ->with(['latestPayment', 'source', 'user'])
            ->first();

        if (! $order) {
            abort(404, __('Order not found'));
        }

        if ($order->user_id !== Auth::id()) {
            abort(403, __('Unauthorized access'));
        }

        return redirect()->route('user.order.complete', ['orderId' => $orderId]);
    }

    /**
     * Top-up payment success page.
     *
     * Same gateway detection pattern as paymentSuccess().
     */
    public function topUpSuccess(Request $request)
    {
        $orderId = $request->query('order_id');
        $sessionId = $request->query('session_id');    // Stripe top-up
        $basketIdent = $request->query('basket_ident');  // Tebex top-up

        // ── STRIPE top-up ─────────────────────────────────────────────────────
        if ($sessionId) {
            $gateway = PaymentGateway::where('slug', 'stripe')->first();

            if ($gateway) {
                try {
                    $result = $gateway->paymentMethod()->confirmPayment($sessionId);

                    if ($result['success']) {
                        Log::info('Stripe top-up payment confirmed successfully', [
                            'session_id' => $sessionId,
                            'order_id' => $orderId,
                        ]);

                        return redirect()->route('user.order.complete', ['orderId' => $orderId])
                            ->with('success', __('Payment completed successfully! Your wallet has been topped up.'));
                    }

                    Log::warning('Stripe top-up payment confirmation failed', [
                        'session_id' => $sessionId,
                        'order_id' => $orderId,
                        'error' => $result['message'] ?? 'Unknown error',
                    ]);

                    return redirect()->route('user.payment.failed', ['order_id' => $orderId])
                        ->with('error', $result['message'] ?? __('Payment confirmation failed'));
                } catch (\Exception $e) {
                    Log::error('Error confirming Stripe top-up payment', [
                        'session_id' => $sessionId,
                        'order_id' => $orderId,
                        'error' => $e->getMessage(),
                    ]);

                    return redirect()->route('user.payment.failed', ['order_id' => $orderId])
                        ->with('error', __('An error occurred while confirming your payment'));
                }
            }
        }

        // ── TEBEX top-up ──────────────────────────────────────────────────────
        // basket_ident comes from the patched complete_url in TebexMethod::startPayment()
        if ($basketIdent) {
            $gateway = PaymentGateway::where('slug', 'tebex')->first();

            if ($gateway) {
                try {
                    $result = $gateway->paymentMethod()->confirmPayment($basketIdent);

                    Log::info('Tebex top-up confirmation result', [
                        'basket_ident' => $basketIdent,
                        'order_id' => $orderId,
                        'result' => $result,
                    ]);

                    if ($result['success']) {
                        return redirect()->route('user.order.complete', ['orderId' => $orderId])
                            ->with('success', __('Payment completed successfully! Your wallet has been topped up.'));
                    }

                    return redirect()->route('user.payment.failed', ['order_id' => $orderId])
                        ->with('error', $result['message'] ?? __('Tebex top-up confirmation failed'));
                } catch (\Exception $e) {
                    Log::error('Error confirming Tebex top-up payment', [
                        'basket_ident' => $basketIdent,
                        'order_id' => $orderId,
                        'error' => $e->getMessage(),
                    ]);

                    return redirect()->route('user.payment.failed', ['order_id' => $orderId])
                        ->with('error', __('An error occurred while confirming your payment'));
                }
            }
        }

        return redirect()->route('user.payment.failed', ['order_id' => $orderId])
            ->with('error', __('Payment gateway not available'));
    }

    /**
     * Payment failed page
     */
    public function paymentFailed(Request $request)
    {
        $orderId = $request->query('order_id');

        $order = Order::where('order_id', $orderId)
            ->with(['latestPayment', 'source', 'user'])
            ->first();

        if ($order && $order->user_id !== Auth::id()) {
            abort(403, __('Unauthorized access'));
        }

        if ($order && $order->latestPayment && $order->user?->email) {
            // \App\Jobs\Payment\SendPaymentFailedEmailJob::dispatch(
            //     $order->id,
            //     $order->latestPayment->id,
            //     $order->user->email
            // );
        }

        return view('payment.failed', compact('order'));
    }

    /**
     * Handle Stripe webhook notifications
     */
    public function stripeWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $stripeGateway = PaymentGateway::findBySlugCached('stripe');
        $webhookSecret = $stripeGateway?->getCredential('webhook_secret')
            ?? config('services.stripe.webhook_secret');

        try {
            if ($webhookSecret) {
                $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
            } else {
                $event = json_decode($payload, true);
            }

            Log::info('Stripe webhook received', [
                'event_type' => $event['type'] ?? 'unknown',
                'event_id' => $event['id'] ?? null,
            ]);

            $gateway = PaymentGateway::where('slug', 'stripe')->first();

            if ($gateway) {
                $gateway->paymentMethod()->handleWebhook(
                    is_array($event) ? $event : $event->toArray()
                );
            }

            return response()->json(['status' => 'success']);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Stripe webhook signature verification failed', ['error' => $e->getMessage()]);

            return response()->json(['error' => __('Invalid signature')], 400);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Handle Tebex webhook notifications
     */
    public function tebexWebhook(Request $request)
    {
        try {
            $payload = $request->all();

            Log::info('Tebex webhook received', [
                'type' => $payload['type'] ?? 'unknown',
                'payload' => $payload,
            ]);

            $tebexGateway = PaymentGateway::where('slug', 'tebex')->first();
            $webhookSecret = $tebexGateway?->getCredential('webhook_secret')
                ?? config('services.tebex.webhook_secret');

            if ($webhookSecret) {
                $signature = $request->header('X-Signature');
                $expectedSig = hash_hmac('sha256', $request->getContent(), $webhookSecret);

                if (! hash_equals($expectedSig, $signature ?? '')) {
                    Log::warning('Tebex webhook: invalid signature');

                    return response()->json(['error' => __('Invalid signature')], 401);
                }
            }

            if ($tebexGateway) {
                $tebexGateway->paymentMethod()->handleWebhook($payload);
            }

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Tebex webhook error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get gateway configuration for frontend
     */
    public function getGatewayConfig(Request $request, string $slug)
    {
        try {
            $gateway = PaymentGateway::where('slug', $slug)
                ->where('is_active', true)
                ->first();

            if (! $gateway) {
                return response()->json(['success' => false, 'message' => __('Payment gateway not found.')], 404);
            }

            $paymentMethod = $gateway->paymentMethod();

            $config = [
                'success' => true,
                'gateway' => [
                    'slug' => $gateway->slug,
                    'name' => $gateway->name,
                    'requires_frontend_js' => method_exists($paymentMethod, 'requiresFrontendJs')
                        ? $paymentMethod->requiresFrontendJs()
                        : false,
                ],
            ];

            if ($gateway->slug === 'stripe') {
                $config['gateway']['publishable_key'] = $gateway->getCredential('api_key')
                    ?? $gateway->getCredential('public_key')
                    ?? config('services.stripe.key');
            }

            if ($gateway->slug === 'wallet' && method_exists($paymentMethod, 'getWalletBalance')) {
                $config['gateway']['wallet'] = $paymentMethod->getWalletBalance(Auth::id());
            }

            return response()->json($config);
        } catch (\Exception $e) {
            Log::error('Get gateway config error', [
                'slug' => $slug,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => __('Error retrieving gateway configuration.'),
                'error_details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
