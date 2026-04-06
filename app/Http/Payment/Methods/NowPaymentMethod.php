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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class NowPaymentMethod extends PaymentMethod
{
    protected $id = 'crypto';

    protected $name = 'Crypto';

    protected $requiresFrontendJs = false;

    protected $currencyService;

    protected $API_KEY;

    protected string $baseUrl;

    public function __construct($gateway, ConversationService $conversationService, AchievementService $achievementService)
    {
        parent::__construct($gateway, $conversationService, $achievementService);
        $this->currencyService = app(CurrencyService::class);

        $this->API_KEY = $this->gateway?->getCredential('api_key')
            ?? config('services.crypto.private_api_key');

        $this->baseUrl = $this->gateway?->getCredential('base_url')
            ?? (($this->gateway?->mode?->value ?? config('services.crypto.env', 'sandbox')) === 'live'
                ? 'https://api.nowpayments.io/v1'
                : 'https://api-sandbox.nowpayments.io/v1');
    }

    protected function headers(): array
    {
        return [
            'x-api-key' => $this->API_KEY,
            'Accept' => 'application/json',
        ];
    }

    /**
     * Start payment - Create NOWPayments Invoice with currency conversion
     */
    public function startPayment(Order $order, array $paymentData = []): array
    {
        try {
            $order->load(['user', 'source.user']);

            return DB::transaction(function () use ($order, $paymentData) {
                $isTopUp = $paymentData['is_topup'] ?? false;
                $topUpAmount = $paymentData['top_up_amount'] ?? null;
                $defultCurrency = $paymentData['default_currency'] ?? $order->currency ?? currency_code();
                $exchangeRate = $paymentData['exchange_rate'] ?? 1;
                $paymentAmount = $isTopUp ? $topUpAmount : ($paymentData['grand_total'] ?? $order->grand_total);
                $paymentAmountDefault = $this->currencyService->convertToDefault($paymentAmount, $defultCurrency);

                $gatewayCurrency = $this->currencyService->getDefaultCurrency()->code;
                $gatewayAmount = $paymentAmountDefault;

                // Update order status to pending
                $order->update([
                    'status' => OrderStatus::PENDING->value,
                    'payment_status' => 'pending',
                    'payment_method' => $this->name,
                ]);

                $metadata = [
                    'is_topup' => $isTopUp,
                    'default_currency' => $defultCurrency,
                    'default_amount' => $paymentAmount,
                    'exchange_rate' => $exchangeRate,
                ];

                if ($isTopUp) {
                    $topUpAmountDefault = $this->currencyService->convertToDefault($topUpAmount, $defultCurrency);
                    $metadata['top_up_amount'] = $topUpAmount;
                    $metadata['top_up_amount_default'] = $topUpAmountDefault;
                }

                // Create payment record
                $payment = Payment::create([
                    'payment_id' => null,
                    'payment_intent_id' => null,
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'name' => $order->user->full_name ?? null,
                    'email_address' => $order->user->email ?? null,
                    'payment_gateway' => $this->id,
                    'amount' => $paymentAmountDefault,
                    'currency' => $this->currencyService->getDefaultCurrency()->code,
                    'status' => PaymentStatus::PENDING->value,
                    'creater_id' => $order->user_id,
                    'creater_type' => get_class($order->user),
                    'metadata' => $metadata,
                ]);

                // Set success/cancel URLs
                if ($isTopUp) {
                    $successUrl = route('user.payment.success')."?order_id={$order->order_id}";
                    $cancelUrl = route('user.payment.failed')."?order_id={$order->order_id}";
                    $description = "Wallet top-up for (Order ID: #{$order->order_id})";
                } else {
                    $successUrl = route('user.payment.success')."?order_id={$order->order_id}";
                    $cancelUrl = route('user.payment.failed')."?order_id={$order->order_id}";
                    $description = "Top-up for (Order ID: #{$order->order_id})";
                }

                // Create NOWPayments invoice
                $response = Http::withHeaders($this->headers())
                    ->post("{$this->baseUrl}/invoice", [
                        'price_amount' => (float) $gatewayAmount,
                        'price_currency' => strtolower($gatewayCurrency),
                        'order_id' => $order->order_id,
                        'order_description' => $description,
                        'ipn_callback_url' => url('/nowpayments/ipn'),
                        'success_url' => $successUrl,
                        'cancel_url' => $cancelUrl,
                    ]);

                if ($response->failed()) {
                    $payment->update(['status' => PaymentStatus::FAILED->value]);
                    $order->update([
                        'status' => OrderStatus::FAILED->value,
                        'payment_status' => 'failed',
                    ]);

                    return [
                        'success' => false,
                        'message' => __('Failed to create payment invoice.'),
                    ];
                }

                $invoice = $response->json();

                if (! isset($invoice['id'])) {
                    return [
                        'success' => false,
                        'message' => __('Invoice ID missing from gateway.'),
                    ];
                }

                // Store invoice ID in payment & order
                $payment->update([
                    'payment_intent_id' => $invoice['id'],
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'checkout_url' => $invoice['invoice_url'] ?? null,
                        'nowpayments_invoice' => $invoice,
                    ]),
                ]);

                $order->update(['payment_intent_id' => $invoice['id']]);

                return [
                    'success' => true,
                    'message' => 'Redirecting to payment gateway...',
                    'checkout_url' => $invoice['invoice_url'] ?? null,
                    'invoice_id' => $invoice['id'],
                    'payment_id' => $payment->payment_id,
                ];
            });
        } catch (Exception $e) {
            $order->update([
                'status' => OrderStatus::FAILED->value,
                'payment_status' => 'failed',
            ]);

            Log::error('Crypto payment init failed', [
                'order_id' => $order->order_id ?? null,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Failed to initialize payment: :message', ['message' => $e->getMessage()]),
            ];
        }
    }

    /**
     * Confirm payment after NOWPayments success
     */
    public function confirmPayment(string $invoiceId, ?string $paymentMethodId = null): array
    {
        try {
            $response = Http::withHeaders($this->headers())
                ->get("{$this->baseUrl}/payment/{$invoiceId}");

            if ($response->failed()) {
                throw new Exception('Invoice fetch failed');
            }

            $invoice = $response->json();

            $status = $invoice['payment_status'] ?? null;
            $nowPaymentId = $invoice['payment_id'];
            $nowInvoiceId = $invoice['invoice_id'];

            // Fetch payment by invoice ID
            $payment = Payment::where('payment_intent_id', $nowInvoiceId)
                ->with(['order.user.wallet', 'order.source.user.wallet', 'user'])
                ->first();

            if (! $payment) {
                throw new Exception('Payment record not found.');
            }

            // Store final payment_id once
            if (! $payment->payment_id) {
                $payment->update([
                    'payment_id' => $nowPaymentId,
                ]);
            }

            if ($payment->status === PaymentStatus::COMPLETED->value) {
                return ['success' => true, 'message' => __('Payment already processed.')];
            }

            $order = $payment->order;
            $isTopUp = $payment->metadata['is_topup'] ?? false;

            if (in_array($status, ['confirmed', 'finished'])) {
                if ($isTopUp) {
                    return $this->processTopUpPayment($invoice, $payment, $order);
                } else {
                    return $this->processRegularPayment($invoice, $payment, $order);
                }
            }

            return [
                'success' => false,
                'message' => __('Payment not completed. Status: :status', ['status' => $status]),
            ];
        } catch (Exception $e) {
            Log::error('Payment confirmation failed', [
                'invoice_id' => $invoiceId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Payment confirmation failed: :message', ['message' => $e->getMessage()]),
            ];
        }
    }

    protected function processTopUpPayment($paymentData, Payment $payment, Order $order): array
    {
        return DB::transaction(function () use ($paymentData, $payment, $order) {
            $payment->lockForUpdate();
            $order->lockForUpdate();

            $topUpData = Session::get("topup_order_{$order->order_id}");

            if (! $topUpData) {
                throw new Exception('Top-up session data not found');
            }

            $topUpAmountDisplay = $topUpData['top_up_amount'];
            $orderTotalDisplay = $topUpData['order_total'];
            $displayCurrency = $payment->metadata['default_currency'] ?? $order->display_currency;

            $topUpAmountDefault = $this->currencyService->convertToDefault($topUpAmountDisplay, $displayCurrency);
            $orderTotalDefault = $order->default_grand_total ?? $this->currencyService->convertToDefault($orderTotalDisplay, $displayCurrency);

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

            $correlationId = Str::uuid();
            $defaultCurrency = $this->currencyService->getDefaultCurrency()->code;

            $balanceBefore = $buyerWallet->balance;
            $balanceAfterTopUp = $balanceBefore + $topUpAmountDefault;
            $balanceAfterPayment = $balanceAfterTopUp - $orderTotalDefault;

            $nowPaymentId = $paymentData['payment_id'];
            $nowInvoiceId = $paymentData['invoice_id'];
            $payinHash = $paymentData['payin_hash'] ?? null;
            $payoutHash = $paymentData['payout_hash'] ?? null;

            // STEP 1: TOP-UP Transaction
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
                'payment_gateway' => 'nowpayments',

                'gateway_transaction_id' => (string) $nowPaymentId,

                'source_id' => $payment->id,
                'source_type' => Payment::class,
                'fee_amount' => 0,
                'net_amount' => $topUpAmountDefault,
                'balance_snapshot' => $balanceAfterTopUp,
                'metadata' => [
                    'nowpayments_payment_id' => $nowPaymentId,
                    'nowpayments_invoice_id' => $nowInvoiceId,
                    'payin_hash' => $payinHash,
                    'payout_hash' => $payoutHash,
                    'pay_currency' => $paymentData['pay_currency'] ?? null,
                    'actually_paid' => $paymentData['actually_paid'] ?? null,
                    'display_amount' => $topUpAmountDisplay,
                    'display_currency' => $displayCurrency,
                    'description' => "Wallet top-up of {$topUpAmountDisplay} {$displayCurrency} via Crypto",
                ],
                'notes' => "Top-up: +{$topUpAmountDefault} {$defaultCurrency} via Crypto (Payment ID: {$nowPaymentId})",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance' => $balanceAfterTopUp,
                'total_deposits' => $buyerWallet->total_deposits + $topUpAmountDefault,
                'last_deposit_at' => now(),
            ]);

            // STEP 2: PAYMENT Transaction
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
                'transaction_id' => (string) $nowInvoiceId,

                'payment_method_id' => (string) $nowPaymentId,

                'paid_at' => now(),
                'metadata' => array_merge($payment->metadata ?? [], [
                    'nowpayments_payment_id' => $nowPaymentId,
                    'nowpayments_invoice_id' => $nowInvoiceId,
                    'nowpayments_status' => $paymentData['payment_status'],
                    'payin_hash' => $payinHash,
                    'payout_hash' => $payoutHash,
                    'pay_currency' => $paymentData['pay_currency'] ?? null,
                    'actually_paid' => $paymentData['actually_paid'] ?? null,
                    'top_up_transaction_id' => $topUpTransaction->id,
                    'payment_transaction_id' => $paymentTransaction->id,
                    'correlation_id' => $correlationId,
                ]),
            ]);

            $this->updateUserPoints($order);

            $order->update([
                'status' => OrderStatus::PAID->value,
                'payment_method' => 'Wallet (Top-up via Crypto)',
                'completed_at' => now(),
            ]);

            Session::forget("topup_order_{$order->order_id}");

            Log::info('Crypto top-up payment completed', [
                'order_id' => $order->order_id,
                'nowpayments_payment_id' => $nowPaymentId,
                'nowpayments_invoice_id' => $nowInvoiceId,
                'correlation_id' => $correlationId,
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
    protected function processRegularPayment($paymentData, Payment $payment, Order $order): array
    {
        return DB::transaction(function () use ($paymentData, $payment, $order) {
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

            $correlationId = Str::uuid();
            $defaultCurrency = $this->currencyService->getDefaultCurrency()->code;

            // Payment amount already in default currency
            $paymentAmountDefault = $payment->amount;
            $orderTotalDefault = $order->default_grand_total ?? $order->grand_total;

            $balanceBefore = $buyerWallet->balance;
            $balanceAfterDeposit = $balanceBefore + $paymentAmountDefault;
            $balanceAfterPayment = $balanceAfterDeposit - $orderTotalDefault;

            $displayCurrency = $payment->metadata['default_currency'] ?? $order->display_currency;
            $displayAmount = $payment->metadata['default_amount'] ?? null;

            $nowPaymentId = $paymentData['payment_id'];
            $nowInvoiceId = $paymentData['invoice_id'];
            $payinHash = $paymentData['payin_hash'] ?? null;
            $payoutHash = $paymentData['payout_hash'] ?? null;
            $payCurrency = $paymentData['pay_currency'] ?? null;
            $actuallyPaid = $paymentData['actually_paid'] ?? null;
            $paymentStatus = $paymentData['payment_status'] ?? null;

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
                'payment_gateway' => 'nowpayments',

                'gateway_transaction_id' => (string) $nowPaymentId,

                'source_id' => $payment->id,
                'source_type' => Payment::class,
                'fee_amount' => 0,
                'net_amount' => $paymentAmountDefault,
                'balance_snapshot' => $balanceAfterDeposit,
                'metadata' => [
                    'nowpayments_payment_id' => $nowPaymentId,
                    'nowpayments_invoice_id' => $nowInvoiceId,
                    'payin_hash' => $payinHash,
                    'payout_hash' => $payoutHash,
                    'pay_currency' => $payCurrency,
                    'actually_paid' => $actuallyPaid,
                    'payment_status' => $paymentStatus,
                    'display_amount' => $displayAmount,
                    'display_currency' => $displayCurrency,
                    'description' => "Top-up via Crypto for Order #{$order->order_id}",
                ],
                'notes' => "Deposit: +{$paymentAmountDefault} {$defaultCurrency} via Crypto (Payment ID: {$nowPaymentId})",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance' => $balanceAfterDeposit,
                'total_deposits' => $buyerWallet->total_deposits + $paymentAmountDefault,
                'last_deposit_at' => now(),
            ]);

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
                    'nowpayments_payment_id' => $nowPaymentId,
                    'nowpayments_invoice_id' => $nowInvoiceId,
                    'description' => "Payment for Order #{$order->order_id}",
                    'deposit_transaction_id' => $depositTransaction->id,
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

                'transaction_id' => (string) $nowInvoiceId,
                'payment_method_id' => (string) $nowPaymentId,

                'paid_at' => now(),
                'metadata' => array_merge($payment->metadata ?? [], [
                    'nowpayments_payment_id' => $nowPaymentId,
                    'nowpayments_invoice_id' => $nowInvoiceId,
                    'nowpayments_status' => $paymentStatus,
                    'payin_hash' => $payinHash,
                    'payout_hash' => $payoutHash,
                    'pay_currency' => $payCurrency,
                    'actually_paid' => $actuallyPaid,
                    'deposit_transaction_id' => $depositTransaction->id,
                    'payment_transaction_id' => $paymentTransaction->id,
                    'correlation_id' => $correlationId,
                ]),
            ]);

            $order->update([
                'status' => OrderStatus::PAID->value,
                'payment_method' => 'Wallet (via Crypto)',
                'completed_at' => now(),
            ]);

            $this->updateUserPoints($order);

            Log::info('Crypto payment confirmed with currency conversion', [
                'order_id' => $order->order_id,
                'nowpayments_payment_id' => $nowPaymentId,
                'nowpayments_invoice_id' => $nowInvoiceId,
                'correlation_id' => $correlationId,
                'display_currency' => $displayCurrency,
                'display_amount' => $displayAmount,
                'default_amount' => $paymentAmountDefault,
                'default_currency' => $defaultCurrency,
                'balance_before' => $balanceBefore,
                'balance_after_deposit' => $balanceAfterDeposit,
                'balance_after_payment' => $balanceAfterPayment,
            ]);

            $this->dispatchPaymentNotificationsOnce($payment);
            $this->sendOrderMessage($order);

            return [
                'success' => true,
                'message' => __('Payment completed successfully'),
                'correlation_id' => $correlationId,
                'nowpayments_payment_id' => $nowPaymentId,
                'nowpayments_invoice_id' => $nowInvoiceId,
            ];
        });
    }

    public function requiresFrontendJs(): bool
    {
        return $this->requiresFrontendJs;
    }
}
