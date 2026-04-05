<?php

namespace App\Http\Payment\Methods;

use App\Enums\CalculationType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Http\Payment\PaymentMethod;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Services\AchievementService;
use App\Services\ConversationService;
use App\Services\CurrencyService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Stripe\Checkout\Session as StripeSession;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripeMethod extends PaymentMethod
{
    protected $id = 'stripe';

    protected $name = 'Stripe';

    protected $requiresFrontendJs = false;

    protected CurrencyService $currencyService;

    public function __construct($gateway, ConversationService $conversationService, AchievementService $achievementService)
    {
        parent::__construct($gateway, $conversationService, $achievementService);
        $this->currencyService = app(CurrencyService::class);

        $secretKey = $this->gateway?->getCredential('secret_key')
            ?? config('services.stripe.secret');

        Stripe::setApiKey($secretKey);
    }

    /**
     * Start payment - Create Stripe Checkout Session with currency conversion
     */
    public function startPayment(Order $order, array $paymentData = []): array
    {
        try {
            $order->load(['user', 'source.user']);

            return DB::transaction(function () use ($order, $paymentData) {
                // Check if this is a top-up payment
                $isTopUp = $paymentData['is_topup'] ?? false;
                $topUpAmount = $paymentData['top_up_amount'] ?? null;

                // Get display currency from payment data or use current
                $displayCurrency = $paymentData['display_currency'] ?? $order->currency ?? currency_code();
                $exchangeRate = $paymentData['exchange_rate'] ?? 1;

                // Determine the payment amount IN DISPLAY CURRENCY
                $paymentAmount = $isTopUp ? $topUpAmount : ($paymentData['grand_total'] ?? $order->grand_total);

                // Convert to default currency for internal storage
                $paymentAmountDefault = $this->currencyService->convertToDefault(
                    $paymentAmount,
                    $displayCurrency
                );

                // Create payment record
                $payment = Payment::create([
                    'payment_id' => generate_payment_id(),
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'name' => $order->user->full_name ?? null,
                    'email_address' => $order->user->email ?? null,
                    'payment_gateway' => $this->id,
                    'amount' => $paymentAmountDefault, // Store in default currency
                    'currency' => $this->currencyService->getDefaultCurrency()->code,
                    'status' => PaymentStatus::PENDING->value,
                    'creater_id' => $order->user_id,
                    'creater_type' => get_class($order->user),
                    'metadata' => [
                        'is_topup' => $isTopUp,
                        'top_up_amount' => $topUpAmount,
                        'display_currency' => $displayCurrency,
                        'display_amount' => $paymentAmount,
                        'exchange_rate' => $exchangeRate,
                    ],
                ]);

                // Determine success and cancel URLs
                if ($isTopUp) {
                    $successUrl = route('user.payment.topup.success').'?session_id={CHECKOUT_SESSION_ID}&order_id='.$order->order_id;
                    $cancelUrl = route('user.payment.failed').'?order_id='.$order->order_id;
                    $description = 'Wallet top-up for (Order ID: #'.$order->order_id.')';
                    $productName = 'Wallet Top-up';
                } else {
                    $successUrl = route('user.payment.success').'?session_id={CHECKOUT_SESSION_ID}&order_id='.$order->order_id;
                    $cancelUrl = route('user.payment.failed').'?order_id='.$order->order_id;
                    $description = 'Top-up for (Order ID: #'.$order->order_id.')';
                    $productName = 'Top-up';
                }

                // Create Stripe Checkout Session IN DISPLAY CURRENCY
                $session = StripeSession::create([
                    'payment_method_types' => ['card'],
                    'line_items' => [
                        [
                            'price_data' => [
                                'currency' => strtolower($displayCurrency),
                                'product_data' => [
                                    'name' => $productName,
                                    'description' => $description,
                                ],
                                'unit_amount' => $this->convertToStripeAmount($paymentAmount, $displayCurrency),
                            ],
                            'quantity' => 1,
                        ],
                    ],
                    'mode' => 'payment',
                    'success_url' => $successUrl,
                    'cancel_url' => $cancelUrl,
                    'metadata' => [
                        'order_id' => $order->order_id,
                        'order_db_id' => $order->id,
                        'payment_id' => $payment->payment_id,
                        'payment_db_id' => $payment->id,
                        'user_id' => $order->user_id,
                        'is_topup' => $isTopUp ? 'true' : 'false',
                        'top_up_amount' => $topUpAmount ?? '',
                        'display_currency' => $displayCurrency,
                        'display_amount' => $paymentAmount,
                        'exchange_rate' => $exchangeRate,
                    ],
                    'customer_email' => $order->user->email ?? null,
                ]);

                $payment->update([
                    'payment_intent_id' => $session->id,
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'stripe_session_id' => $session->id,
                        'checkout_url' => $session->url,
                    ]),
                ]);

                Log::info('Stripe Checkout Session created with currency', [
                    'order_id' => $order->order_id,
                    'session_id' => $session->id,
                    'payment_id' => $payment->payment_id,
                    'is_topup' => $isTopUp,
                    'display_amount' => $paymentAmount,
                    'display_currency' => $displayCurrency,
                    'default_amount' => $paymentAmountDefault,
                    'default_currency' => $this->currencyService->getDefaultCurrency()->code,
                ]);

                return [
                    'success' => true,
                    'checkout_url' => $session->url,
                    'session_id' => $session->id,
                    'payment_id' => $payment->payment_id,
                    'message' => __('Redirecting to Stripe Checkout...'),
                ];
            });
        } catch (Exception $e) {
            Log::error('Stripe payment initialization failed', [
                'order_id' => $order->order_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ['success' => false, 'message' => __('Failed to initialize Stripe payment: :message', ['message' => $e->getMessage()])];
        }
    }

    /**
     * Confirm payment after Stripe success
     */
    public function confirmPayment(string $sessionId, ?string $paymentMethodId = null): array
    {
        try {
            $session = StripeSession::retrieve($sessionId);

            if (! $session) {
                throw new Exception('Stripe session not found');
            }

            $payment = Payment::with(['order.user.wallet', 'order.source.user.wallet', 'user'])
                ->where('payment_intent_id', $sessionId)
                ->first();

            if (! $payment) {
                throw new Exception('Payment record not found.');
            }

            if ($payment->status === PaymentStatus::COMPLETED->value) {
                return ['success' => true, 'message' => __('Payment already processed.')];
            }

            $order = $payment->order;
            $isTopUp = ($payment->metadata['is_topup'] ?? false) || ($session->metadata['is_topup'] ?? 'false') === 'true';

            if ($session->payment_status === 'paid') {
                if ($isTopUp) {
                    return $this->processTopUpPayment($session, $payment, $order);
                } else {
                    return $this->processRegularPayment($session, $payment, $order);
                }
            }

            return [
                'success' => false,
                'message' => __('Payment not completed. Status: :status', ['status' => $session->payment_status]),
            ];
        } catch (Exception $e) {
            Log::error('Payment confirmation failed', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Payment confirmation failed: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Process top-up payment with currency conversion
     * Wallet is ALWAYS in default currency
     */
    protected function processTopUpPayment($session, Payment $payment, Order $order): array
    {
        return DB::transaction(function () use ($session, $payment, $order) {
            $payment->lockForUpdate();
            $order->lockForUpdate();

            $topUpData = Session::get("topup_order_{$order->order_id}");

            if (! $topUpData) {
                throw new Exception('Top-up session data not found');
            }

            // Amounts from session are in DISPLAY currency
            $topUpAmountDisplay = $topUpData['top_up_amount'];
            $orderTotalDisplay = $topUpData['order_total'];

            // Get display currency from metadata
            $displayCurrency = $payment->metadata['display_currency'] ?? $order->display_currency;

            // Convert amounts to DEFAULT currency for wallet operations
            $topUpAmountDefault = $this->currencyService->convertToDefault($topUpAmountDisplay, $displayCurrency);
            $orderTotalDefault = $order->default_grand_total ?? $this->currencyService->convertToDefault($orderTotalDisplay, $displayCurrency);

            // Get wallet (always in default currency)
            $buyerWallet = $order->user->wallet ?? Wallet::firstOrCreate(
                ['user_id' => $order->user_id],
                [
                    'currency_code' => $this->currencyService->getDefaultCurrency()->code,
                    'balance' => 0,
                    'locked_balance' => 0,
                    'pending_balance' => 0,
                    'total_deposits' => 0,
                    'total_withdrawals' => 0,
                ]
            );

            $buyerWallet->lockForUpdate();

            $paymentIntent = PaymentIntent::retrieve($session->payment_intent);
            $correlationId = Str::uuid();
            $defaultCurrency = $this->currencyService->getDefaultCurrency()->code;

            $balanceBefore = $buyerWallet->balance;
            $balanceAfterTopUp = $balanceBefore + $topUpAmountDefault;
            $balanceAfterPayment = $balanceAfterTopUp - $orderTotalDefault;

            // STEP 1: TOP-UP (in default currency)
            $topUpTransaction = Transaction::create([
                'transaction_id' => generate_transaction_id_hybrid(),
                'correlation_id' => $correlationId,
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'type' => TransactionType::TOPUP->value,
                'status' => TransactionStatus::PAID->value,
                'calculation_type' => CalculationType::DEBIT->value,
                'amount' => $topUpAmountDefault,
                'currency' => $defaultCurrency,
                'payment_gateway' => $this->id,
                'gateway_transaction_id' => $session->payment_intent,
                'source_id' => $payment->id,
                'source_type' => Payment::class,
                'fee_amount' => 0,
                'net_amount' => $topUpAmountDefault,
                'balance_snapshot' => $balanceAfterTopUp,
                'metadata' => [
                    'stripe_session_id' => $session->id,
                    'payment_intent_id' => $session->payment_intent,
                    'receipt_url' => $paymentIntent->charges->data[0]->receipt_url ?? null,
                    'display_amount' => $topUpAmountDisplay,
                    'display_currency' => $displayCurrency,
                    'description' => "Wallet top-up of {$topUpAmountDisplay} {$displayCurrency} (={$topUpAmountDefault} {$defaultCurrency}) via Stripe",
                ],
                'notes' => "Top-up: +{$topUpAmountDefault} {$defaultCurrency} via Stripe",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance' => $balanceAfterTopUp,
                'total_deposits' => $buyerWallet->total_deposits + $topUpAmountDefault,
                'last_deposit_at' => now(),
            ]);

            // STEP 2: PAYMENT (in default currency)
            $paymentTransaction = Transaction::create([
                'transaction_id' => generate_transaction_id_hybrid(),
                'correlation_id' => $correlationId,
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'type' => TransactionType::PURCHSED->value,
                'status' => TransactionStatus::PAID->value,
                'calculation_type' => CalculationType::CREDIT->value,
                'amount' => $orderTotalDefault,
                'currency' => $defaultCurrency,
                'payment_gateway' => 'wallet',
                'gateway_transaction_id' => $topUpTransaction->transaction_id,
                'source_id' => $payment->id,
                'source_type' => Payment::class,
                'fee_amount' => 0,
                'net_amount' => $orderTotalDefault,
                'balance_snapshot' => $balanceAfterPayment,
                'metadata' => [
                    'stripe_session_id' => $session->id,
                    'description' => "Order payment for #{$order->order_id}",
                    'top_up_transaction_id' => $topUpTransaction->transaction_id,
                    'display_amount' => $orderTotalDisplay,
                    'display_currency' => $displayCurrency,
                ],
                'notes' => "Payment: -{$orderTotalDefault} {$defaultCurrency} for Order #{$order->order_id}",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance' => $balanceAfterPayment,
                'total_withdrawals' => $buyerWallet->total_withdrawals + $orderTotalDefault,
                'last_withdrawal_at' => now(),
            ]);

            $payment->update([
                'status' => PaymentStatus::COMPLETED->value,
                'transaction_id' => $session->payment_intent,
                'payment_method_id' => $paymentIntent->payment_method ?? null,
                'card_brand' => $paymentIntent->charges->data[0]->payment_method_details->card->brand ?? null,
                'card_last4' => $paymentIntent->charges->data[0]->payment_method_details->card->last4 ?? null,
                'paid_at' => now(),
                'metadata' => array_merge($payment->metadata ?? [], [
                    'payment_intent_id' => $session->payment_intent,
                    'stripe_receipt_url' => $paymentIntent->charges->data[0]->receipt_url ?? null,
                    'top_up_transaction_id' => $topUpTransaction->id,
                    'payment_transaction_id' => $paymentTransaction->id,
                    'correlation_id' => $correlationId,
                ]),
            ]);

            $this->updateUserPoints($order);

            $order->update([
                'status' => OrderStatus::PAID->value,
                'payment_method' => 'Wallet (Top-up via Stripe)',
                'completed_at' => now(),
            ]);

            Session::forget("topup_order_{$order->order_id}");

            Log::info('Top-up payment flow completed with currency conversion', [
                'order_id' => $order->order_id,
                'correlation_id' => $correlationId,
                'display_currency' => $displayCurrency,
                'top_up_display' => $topUpAmountDisplay,
                'top_up_default' => $topUpAmountDefault,
                'final_balance' => $balanceAfterPayment,
            ]);

            $this->dispatchPaymentNotificationsOnce($payment);
            $this->sendOrderMessage($order);

            return [
                'success' => true,
                'message' => __('Payment completed successfully'),
                'correlation_id' => $correlationId,
            ];
        });
    }

    /**
     * Process regular payment with currency conversion
     */
    protected function processRegularPayment($session, Payment $payment, Order $order): array
    {
        return DB::transaction(function () use ($session, $payment, $order) {
            $payment->lockForUpdate();
            $order->lockForUpdate();

            $buyerWallet = $order->user->wallet ?? Wallet::firstOrCreate(
                ['user_id' => $order->user_id],
                [
                    'currency_code' => $this->currencyService->getDefaultCurrency()->code,
                    'balance' => 0,
                    'locked_balance' => 0,
                    'pending_balance' => 0,
                    'total_deposits' => 0,
                    'total_withdrawals' => 0,
                ]
            );

            $buyerWallet->lockForUpdate();

            $paymentIntent = PaymentIntent::retrieve($session->payment_intent);
            $correlationId = Str::uuid();
            $defaultCurrency = $this->currencyService->getDefaultCurrency()->code;

            // Payment amount is already in default currency
            $paymentAmountDefault = $payment->amount;
            $orderTotalDefault = $order->default_grand_total ?? $order->grand_total;

            $balanceBefore = $buyerWallet->balance;
            $balanceAfterDeposit = $balanceBefore + $paymentAmountDefault;
            $balanceAfterPayment = $balanceAfterDeposit - $orderTotalDefault;

            // Get display currency info
            $displayCurrency = $payment->metadata['display_currency'] ?? $order->display_currency;
            $displayAmount = $payment->metadata['display_amount'] ?? null;

            // TRANSACTION 1: DEPOSIT
            $depositTransaction = Transaction::create([
                'transaction_id' => generate_transaction_id_hybrid(),
                'correlation_id' => $correlationId,
                'user_id' => $payment->user_id,
                'order_id' => $order->id,
                'type' => TransactionType::TOPUP->value,
                'status' => TransactionStatus::PAID->value,
                'calculation_type' => CalculationType::DEBIT->value,
                'amount' => $paymentAmountDefault,
                'currency' => $defaultCurrency,
                'payment_gateway' => $this->id,
                'gateway_transaction_id' => $session->payment_intent,
                'source_id' => $payment->id,
                'source_type' => Payment::class,
                'fee_amount' => 0,
                'net_amount' => $paymentAmountDefault,
                'balance_snapshot' => $balanceAfterDeposit,
                'metadata' => [
                    'stripe_session_id' => $session->id,
                    'payment_intent_id' => $session->payment_intent,
                    'receipt_url' => $paymentIntent->charges->data[0]->receipt_url ?? null,
                    'display_amount' => $displayAmount,
                    'display_currency' => $displayCurrency,
                    'description' => "Top-up via Stripe for Order #{$order->order_id}",
                ],
                'notes' => "Deposit: +{$paymentAmountDefault} {$defaultCurrency} via Stripe",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance' => $balanceAfterDeposit,
                'total_deposits' => $buyerWallet->total_deposits + $paymentAmountDefault,
                'last_deposit_at' => now(),
            ]);

            // TRANSACTION 2: PAYMENT
            $paymentTransaction = Transaction::create([
                'transaction_id' => generate_transaction_id_hybrid(),
                'correlation_id' => $correlationId,
                'user_id' => $payment->user_id,
                'order_id' => $order->id,
                'type' => TransactionType::PURCHSED->value,
                'status' => TransactionStatus::PAID->value,
                'calculation_type' => CalculationType::CREDIT->value,
                'amount' => $orderTotalDefault,
                'currency' => $defaultCurrency,
                'payment_gateway' => 'wallet',
                'gateway_transaction_id' => $depositTransaction->transaction_id,
                'source_id' => $payment->id,
                'source_type' => Payment::class,
                'fee_amount' => 0,
                'net_amount' => $orderTotalDefault,
                'balance_snapshot' => $balanceAfterPayment,
                'metadata' => [
                    'stripe_session_id' => $session->id,
                    'payment_intent_id' => $session->payment_intent,
                    'description' => "Payment for Order #{$order->order_id}",
                ],
                'notes' => "Payment: -{$orderTotalDefault} {$defaultCurrency} for Order #{$order->order_id}",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance' => $balanceAfterPayment,
                'total_withdrawals' => $buyerWallet->total_withdrawals + $orderTotalDefault,
                'last_withdrawal_at' => now(),
            ]);

            $payment->update([
                'status' => PaymentStatus::COMPLETED->value,
                'transaction_id' => $session->payment_intent,
                'payment_method_id' => $paymentIntent->payment_method ?? null,
                'card_brand' => $paymentIntent->charges->data[0]->payment_method_details->card->brand ?? null,
                'card_last4' => $paymentIntent->charges->data[0]->payment_method_details->card->last4 ?? null,
                'paid_at' => now(),
                'metadata' => array_merge($payment->metadata ?? [], [
                    'payment_intent_id' => $session->payment_intent,
                    'stripe_receipt_url' => $paymentIntent->charges->data[0]->receipt_url ?? null,
                    'deposit_transaction_id' => $depositTransaction->id,
                    'payment_transaction_id' => $paymentTransaction->id,
                    'correlation_id' => $correlationId,
                ]),
            ]);

            $order->update([
                'status' => OrderStatus::PAID->value,
                'payment_method' => 'Wallet (via Stripe)',
                'completed_at' => now(),
            ]);

            $this->updateUserPoints($order);

            Log::info('Stripe payment confirmed with currency conversion', [
                'order_id' => $order->order_id,
                'correlation_id' => $correlationId,
                'display_currency' => $displayCurrency,
            ]);

            $this->dispatchPaymentNotificationsOnce($payment);
            $this->sendOrderMessage($order);

            return [
                'success' => true,
                'message' => __('Payment completed successfully'),
                'correlation_id' => $correlationId,
            ];
        });
    }

    protected function convertToStripeAmount(float $amount, string $currency): int
    {
        $zeroDecimalCurrencies = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];

        if (in_array(strtoupper($currency), $zeroDecimalCurrencies)) {
            return (int) round($amount);
        }

        return (int) round($amount * 100);
    }

    // Webhook methods remain the same...
    public function handleWebhook(array $payload): void
    {
        $eventType = $payload['type'] ?? null;
        Log::info('Processing Stripe webhook', ['event_type' => $eventType]);

        switch ($eventType) {
            case 'checkout.session.completed':
                $this->handleCheckoutCompleted($payload['data']['object']);
                break;
            case 'payment_intent.succeeded':
                $this->handlePaymentSuccess($payload['data']['object']);
                break;
            case 'payment_intent.payment_failed':
                $this->handlePaymentFailed($payload['data']['object']);
                break;
            case 'payment_intent.canceled':
                $this->handlePaymentCanceled($payload['data']['object']);
                break;
            default:
                Log::info('Unhandled Stripe webhook event', ['event_type' => $eventType]);
        }
    }

    protected function handleCheckoutCompleted(array $session): void
    {
        try {
            $orderId = $session['metadata']['order_id'] ?? null;
            if (! $orderId) {
                return;
            }

            $order = Order::with(['latestPayment'])->where('order_id', $orderId)->first();
            if (! $order) {
                return;
            }

            $payment = $order->latestPayment;
            if ($payment && $payment->status === PaymentStatus::COMPLETED->value) {
                return;
            }

            if ($payment && $session['payment_status'] === 'paid') {
                $this->confirmPayment($session['id']);
            }
        } catch (Exception $e) {
            Log::error('Error processing checkout completed webhook', ['error' => $e->getMessage()]);
        }
    }

    protected function handlePaymentSuccess(array $paymentIntent): void {}

    protected function handlePaymentFailed(array $paymentIntent): void {}

    protected function handlePaymentCanceled(array $paymentIntent): void {}
}
