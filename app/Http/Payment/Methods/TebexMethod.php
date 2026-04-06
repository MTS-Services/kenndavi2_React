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

class TebexMethod extends PaymentMethod
{
    protected $id = 'tebex';

    protected $name = 'Tebex';

    protected $requiresFrontendJs = false;

    protected CurrencyService $currencyService;

    protected string $projectId;

    protected string $publicToken;

    protected string $privateKey;

    protected string $checkoutUrl;

    public function __construct($gateway, ConversationService $conversationService, AchievementService $achievementService)
    {
        parent::__construct($gateway, $conversationService, $achievementService);
        $this->currencyService = app(CurrencyService::class);

        // Project ID = Basic Auth USERNAME
        $this->projectId = $this->gateway?->getCredential('project_id')
            ?? config('services.tebex.project_id');

        $this->publicToken = $this->gateway?->getCredential('public_token')
            ?? config('services.tebex.public_token');

        // Private Key = Basic Auth PASSWORD
        $this->privateKey = $this->gateway?->getCredential('private_key')
            ?? config('services.tebex.private_key');

        $this->checkoutUrl = $this->gateway?->getCredential('checkout_url')
            ?? config('services.tebex.checkout_url', 'https://checkout.tebex.io/api');
    }

    // -------------------------------------------------------------------------
    // HTTP helpers
    // -------------------------------------------------------------------------

    protected function headers(): array
    {
        return [
            'Accept'       => 'application/json',
            'Content-Type' => 'application/json',
        ];
    }

    protected function http()
    {
        return Http::withBasicAuth($this->projectId, $this->privateKey)
            ->withHeaders($this->headers());
    }

    // -------------------------------------------------------------------------
    // Start Payment
    // -------------------------------------------------------------------------

    /**
     * Flow:
     *  1. Create basket (temp complete_url)          → get $basketIdent
     *  2. Patch basket complete_url with basket_ident  ← KEY CHANGE
     *     Result: ?order_id=xxx&basket_ident=yyy       (like session_id / NP_id)
     *  3. Add package to basket
     *  4. Return checkout URL to redirect user
     */
    public function startPayment(Order $order, array $paymentData = []): array
    {
        try {
            $order->load(['user', 'source.user']);

            return DB::transaction(function () use ($order, $paymentData) {

                $isTopUp         = $paymentData['is_topup'] ?? false;
                $topUpAmount     = $paymentData['top_up_amount'] ?? null;
                $displayCurrency = $paymentData['display_currency'] ?? $order->currency ?? currency_code();
                $exchangeRate    = $paymentData['exchange_rate'] ?? 1;

                $paymentAmount = $isTopUp
                    ? $topUpAmount
                    : ($paymentData['grand_total'] ?? $order->grand_total);

                $paymentAmountDefault = $this->currencyService->convertToDefault(
                    $paymentAmount,
                    $displayCurrency
                );

                $gatewayAmount = $paymentAmount;

                // ── Update order to PENDING ───────────────────────────────────
                $order->update([
                    'status'         => OrderStatus::PENDING->value,
                    'payment_status' => 'pending',
                    'payment_method' => $this->name,
                ]);

                // ── Build metadata ────────────────────────────────────────────
                $metadata = [
                    'is_topup'         => $isTopUp,
                    'display_currency' => $displayCurrency,
                    'display_amount'   => $paymentAmount,
                    'exchange_rate'    => $exchangeRate,
                ];

                if ($isTopUp) {
                    $topUpAmountDefault = $this->currencyService->convertToDefault(
                        $topUpAmount,
                        $displayCurrency
                    );
                    $metadata['top_up_amount']        = $topUpAmount;
                    $metadata['top_up_amount_default'] = $topUpAmountDefault;
                }

                // ── Create Payment record ─────────────────────────────────────
                $payment = Payment::create([
                    'payment_id'        => generate_payment_id(),
                    'payment_intent_id' => null,
                    'user_id'           => $order->user_id,
                    'order_id'          => $order->id,
                    'name'              => $order->user->full_name ?? null,
                    'email_address'     => $order->user->email ?? null,
                    'payment_gateway'   => $this->id,
                    'amount'            => $paymentAmountDefault,
                    'currency'          => $this->currencyService->getDefaultCurrency()->code,
                    'status'            => PaymentStatus::PENDING->value,
                    'creater_id'        => $order->user_id,
                    'creater_type'      => get_class($order->user),
                    'metadata'          => $metadata,
                ]);

                // ── URLs ──────────────────────────────────────────────────────
                $cancelUrl    = route('user.payment.failed') . '?order_id=' . $order->order_id;
                $successRoute = $isTopUp ? 'user.payment.topup.success' : 'user.payment.success';
                $description  = $isTopUp ? "Wallet top-up for (Order ID: #{$order->order_id})" : "Top-up for (Order ID: #{$order->order_id})";
                $productName  = $isTopUp ? 'Wallet top-up' : 'Top-up';

                // Temporary complete_url — we update it in STEP 2 once we have the ident
                $tempSuccessUrl = route($successRoute) . '?order_id=' . $order->order_id;

                // ── STEP 1: Create Tebex Basket ───────────────────────────────
                $basketResponse = $this->http()->post("{$this->checkoutUrl}/baskets", [
                    'return_url'             => $cancelUrl,
                    'complete_url'           => $tempSuccessUrl,
                    'complete_auto_redirect' => true,
                    'first_name'             => $order->user->first_name ?? null,
                    'last_name'              => $order->user->last_name  ?? null,
                    'email'                  => $order->user->email      ?? null,
                    'ip'                     => request()->ip(),
                    'custom'                 => [
                        'order_id'   => $order->order_id,
                        'payment_id' => $payment->payment_id,
                        'user_id'    => $order->user_id,
                        'is_topup'   => $isTopUp,
                    ],
                ]);

                if ($basketResponse->failed()) {
                    $this->markFailed($payment, $order);
                    Log::error('Tebex basket creation failed', [
                        'order_id' => $order->order_id,
                        'response' => $basketResponse->body(),
                    ]);
                    return [
                        'success' => false,
                        'message' => 'Failed to create Tebex basket: ' . ($basketResponse->json('message') ?? $basketResponse->body()),
                    ];
                }

                $basket      = $basketResponse->json();
                $basketIdent = $basket['ident'] ?? null;

                if (! $basketIdent) {
                    $this->markFailed($payment, $order);
                    return ['success' => false, 'message' => 'Tebex basket ident missing from response.'];
                }

                // ── STEP 2: Patch complete_url to inject basket_ident ─────────
                // Mirrors how Stripe appends {CHECKOUT_SESSION_ID} and
                // NowPayments appends NP_id to the success URL.
                //
                //  Stripe:      ?session_id={CHECKOUT_SESSION_ID}
                //  NowPayments: ?NP_id=xxx
                //  Tebex:       ?basket_ident=xxx   ← injected here
                //
                $finalSuccessUrl = route($successRoute)
                    . '?order_id='     . $order->order_id
                    . '&basket_ident=' . $basketIdent;

                $patchResponse = $this->http()->put(
                    "{$this->checkoutUrl}/baskets/{$basketIdent}",
                    [
                        'complete_url'           => $finalSuccessUrl,
                        'complete_auto_redirect' => true,
                    ]
                );

                if ($patchResponse->failed()) {
                    // Non-fatal: controller has a DB-fallback, but log it clearly
                    Log::warning('Tebex basket complete_url patch failed — controller will use DB fallback', [
                        'order_id'          => $order->order_id,
                        'basket_ident'      => $basketIdent,
                        'final_success_url' => $finalSuccessUrl,
                        'response'          => $patchResponse->body(),
                    ]);
                } else {
                    Log::info('Tebex basket complete_url patched with basket_ident', [
                        'order_id'          => $order->order_id,
                        'basket_ident'      => $basketIdent,
                        'final_success_url' => $finalSuccessUrl,
                    ]);
                }

                // ── STEP 3: Add Package to Basket ─────────────────────────────
                $packageResponse = $this->http()->post(
                    "{$this->checkoutUrl}/baskets/{$basketIdent}/packages",
                    [
                        'package' => [
                            'name'  =>  $productName,
                            'price' => (float) $gatewayAmount,
                            'type'  => 'single',
                            'qty'   => 1,
                        ],
                        'custom' => [
                            'description' => $description,
                            'order_id'    => $order->order_id,
                        ],
                    ]
                );

                if ($packageResponse->failed()) {
                    $this->markFailed($payment, $order);
                    Log::error('Tebex add package failed', [
                        'order_id'     => $order->order_id,
                        'basket_ident' => $basketIdent,
                        'response'     => $packageResponse->body(),
                    ]);
                    return [
                        'success' => false,
                        'message' => 'Failed to add package to Tebex basket: ' . ($packageResponse->json('message') ?? $packageResponse->body()),
                    ];
                }

                // ── Resolve Checkout URL ──────────────────────────────────────
                $checkoutUrl = $basket['links']['checkout']
                    ?? "https://checkout.tebex.io/checkout/{$basketIdent}";

                // ── Persist basket ident & checkout URL ───────────────────────
                $payment->update([
                    'payment_intent_id' => $basketIdent,
                    'metadata'          => array_merge($payment->metadata ?? [], [
                        'tebex_basket_ident' => $basketIdent,
                        'checkout_url'       => $checkoutUrl,
                        'tebex_basket'       => $basket,
                    ]),
                ]);

                $order->update(['payment_intent_id' => $basketIdent]);

                Log::info('Tebex basket created', [
                    'order_id'          => $order->order_id,
                    'basket_ident'      => $basketIdent,
                    'payment_id'        => $payment->payment_id,
                    'is_topup'          => $isTopUp,
                    'display_amount'    => $paymentAmount,
                    'display_currency'  => $displayCurrency,
                    'default_amount'    => $paymentAmountDefault,
                    'final_success_url' => $finalSuccessUrl,
                ]);

                return [
                    'success'      => true,
                    'checkout_url' => $checkoutUrl,
                    'basket_ident' => $basketIdent,
                    'payment_id'   => $payment->payment_id,
                    'message'      => 'Redirecting to Tebex Checkout...',
                ];
            });
        } catch (Exception $e) {
            $order->update([
                'status'         => OrderStatus::FAILED->value,
                'payment_status' => 'failed',
            ]);

            Log::error('Tebex payment initialization failed', [
                'order_id' => $order->order_id,
                'error'    => $e->getMessage(),
                'trace'    => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to initialize Tebex payment: ' . $e->getMessage(),
            ];
        }
    }

    // -------------------------------------------------------------------------
    // Confirm Payment
    // -------------------------------------------------------------------------

    public function confirmPayment(string $basketIdent, ?string $paymentMethodId = null): array
    {
        try {
            $response = $this->http()->get("{$this->checkoutUrl}/baskets/{$basketIdent}");

            if ($response->failed()) {
                throw new Exception('Tebex basket fetch failed: ' . $response->body());
            }

            $basket = $response->json();

            // ✅ Tebex uses 'complete' (bool) NOT 'status' (string)
            // Also cross-check payment.status as a secondary confirmation
            $isComplete = ($basket['complete'] ?? false) === true
                || ($basket['payment']['status'] ?? null) === 'complete';

            Log::info('Tebex basket fetch response', [
                'basket_ident' => $basketIdent,
                'complete'     => $basket['complete']           ?? null,  // ← actual field
                'pay_status'   => $basket['payment']['status']  ?? null,
                'is_complete'  => $isComplete,
            ]);

            $payment = Payment::where('payment_intent_id', $basketIdent)
                ->with(['order.user.wallet', 'order.source.user.wallet', 'user'])
                ->first();

            if (! $payment) {
                throw new Exception('Payment record not found for basket: ' . $basketIdent);
            }

            if ($payment->status === PaymentStatus::COMPLETED->value) {
                return ['success' => true, 'message' => 'Payment already processed.'];
            }

            $order   = $payment->order;
            $isTopUp = $payment->metadata['is_topup'] ?? false;

            if ($isComplete) {
                return $isTopUp
                    ? $this->processTopUpPayment($basket, $payment, $order)
                    : $this->processRegularPayment($basket, $payment, $order);
            }

            return [
                'success' => false,
                'message' => 'Payment not completed. Tebex basket complete: ' . json_encode($basket['complete'] ?? false),
            ];
        } catch (Exception $e) {
            Log::error('Tebex payment confirmation failed', [
                'basket_ident' => $basketIdent,
                'error'        => $e->getMessage(),
                'trace'        => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Payment confirmation failed: ' . $e->getMessage(),
            ];
        }
    }

    // -------------------------------------------------------------------------
    // Process Top-Up Payment
    // -------------------------------------------------------------------------

    protected function processTopUpPayment($basket, Payment $payment, Order $order): array
    {
        return DB::transaction(function () use ($basket, $payment, $order) {
            $payment->lockForUpdate();
            $order->lockForUpdate();

            $topUpData = Session::get("topup_order_{$order->order_id}");
            if (! $topUpData) {
                throw new Exception('Top-up session data not found');
            }

            $topUpAmountDisplay = $topUpData['top_up_amount'];
            $orderTotalDisplay  = $topUpData['order_total'];
            $displayCurrency    = $payment->metadata['display_currency'] ?? $order->display_currency;

            $topUpAmountDefault = $this->currencyService->convertToDefault($topUpAmountDisplay, $displayCurrency);
            $orderTotalDefault  = $order->default_grand_total
                ?? $this->currencyService->convertToDefault($orderTotalDisplay, $displayCurrency);

            $buyerWallet = $order->user->wallet ?? Wallet::firstOrCreate(
                ['user_id' => $order->user_id],
                [
                    'currency_code'     => $this->currencyService->getDefaultCurrency()->code,
                    'balance'           => 0,
                    'locked_balance'    => 0,
                    'pending_balance'   => 0,
                    'total_deposits'    => 0,
                    'total_withdrawals' => 0,
                ]
            );

            $buyerWallet->lockForUpdate();

            $correlationId   = Str::uuid();
            $defaultCurrency = $this->currencyService->getDefaultCurrency()->code;

            $balanceBefore       = $buyerWallet->balance;
            $balanceAfterTopUp   = $balanceBefore + $topUpAmountDefault;
            $balanceAfterPayment = $balanceAfterTopUp - $orderTotalDefault;

            $basketIdent    = $basket['ident'] ?? $payment->payment_intent_id;
            $tebexPaymentId = $basket['payment']['transaction_id'] ?? null;

            $topUpTransaction = Transaction::create([
                'transaction_id'         => generate_transaction_id_hybrid(),
                'correlation_id'         => $correlationId,
                'user_id'                => $order->user_id,
                'order_id'               => $order->id,
                'type'                   => TransactionType::TOPUP->value,
                'status'                 => TransactionStatus::PAID->value,
                'calculation_type'       => CalculationType::DEBIT->value,
                'amount'                 => $topUpAmountDefault,
                'currency'               => $defaultCurrency,
                'payment_gateway'        => $this->id,
                'gateway_transaction_id' => $basketIdent,
                'source_id'              => $payment->id,
                'source_type'            => Payment::class,
                'fee_amount'             => 0,
                'net_amount'             => $topUpAmountDefault,
                'balance_snapshot'       => $balanceAfterTopUp,
                'metadata'               => [
                    'tebex_basket_ident' => $basketIdent,
                    'tebex_payment_id'   => $tebexPaymentId,
                    'display_amount'     => $topUpAmountDisplay,
                    'display_currency'   => $displayCurrency,
                    'description'        => "Wallet top-up of {$topUpAmountDisplay} {$displayCurrency} (={$topUpAmountDefault} {$defaultCurrency}) via Tebex",
                ],
                'notes'        => "Top-up: +{$topUpAmountDefault} {$defaultCurrency} via Tebex",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance'         => $balanceAfterTopUp,
                'total_deposits'  => $buyerWallet->total_deposits + $topUpAmountDefault,
                'last_deposit_at' => now(),
            ]);

            $paymentTransaction = Transaction::create([
                'transaction_id'         => generate_transaction_id_hybrid(),
                'correlation_id'         => $correlationId,
                'user_id'                => $order->user_id,
                'order_id'               => $order->id,
                'type'                   => TransactionType::PURCHSED->value,
                'status'                 => TransactionStatus::PAID->value,
                'calculation_type'       => CalculationType::CREDIT->value,
                'amount'                 => $orderTotalDefault,
                'currency'               => $defaultCurrency,
                'payment_gateway'        => 'wallet',
                'gateway_transaction_id' => $topUpTransaction->transaction_id,
                'source_id'              => $payment->id,
                'source_type'            => Payment::class,
                'fee_amount'             => 0,
                'net_amount'             => $orderTotalDefault,
                'balance_snapshot'       => $balanceAfterPayment,
                'metadata'               => [
                    'tebex_basket_ident'    => $basketIdent,
                    'description'           => "Order payment for #{$order->order_id}",
                    'top_up_transaction_id' => $topUpTransaction->transaction_id,
                    'display_amount'        => $orderTotalDisplay,
                    'display_currency'      => $displayCurrency,
                ],
                'notes'        => "Payment: -{$orderTotalDefault} {$defaultCurrency} for Order #{$order->order_id}",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance'            => $balanceAfterPayment,
                'total_withdrawals'  => $buyerWallet->total_withdrawals + $orderTotalDefault,
                'last_withdrawal_at' => now(),
            ]);

            $payment->update([
                'status'         => PaymentStatus::COMPLETED->value,
                'transaction_id' => $basketIdent,
                'paid_at'        => now(),
                'metadata'       => array_merge($payment->metadata ?? [], [
                    'tebex_basket_ident'     => $basketIdent,
                    'tebex_payment_id'       => $tebexPaymentId,
                    'top_up_transaction_id'  => $topUpTransaction->id,
                    'payment_transaction_id' => $paymentTransaction->id,
                    'correlation_id'         => $correlationId,
                ]),
            ]);

            $this->updateUserPoints($order);

            $order->update([
                'status'         => OrderStatus::PAID->value,
                'payment_method' => 'Wallet (Top-up via Tebex)',
                'completed_at'   => now(),
            ]);

            Session::forget("topup_order_{$order->order_id}");

            Log::info('Tebex top-up payment completed', [
                'order_id'         => $order->order_id,
                'basket_ident'     => $basketIdent,
                'correlation_id'   => $correlationId,
                'display_currency' => $displayCurrency,
                'final_balance'    => $balanceAfterPayment,
            ]);

            $this->dispatchPaymentNotificationsOnce($payment);
            $this->sendOrderMessage($order);

            return ['success' => true, 'message' => 'Payment completed successfully', 'correlation_id' => $correlationId];
        });
    }

    // -------------------------------------------------------------------------
    // Process Regular Payment
    // -------------------------------------------------------------------------

    protected function processRegularPayment($basket, Payment $payment, Order $order): array
    {
        return DB::transaction(function () use ($basket, $payment, $order) {
            $payment->lockForUpdate();
            $order->lockForUpdate();

            $buyerWallet = $order->user->wallet ?? Wallet::firstOrCreate(
                ['user_id' => $order->user_id],
                [
                    'currency_code'     => $this->currencyService->getDefaultCurrency()->code,
                    'balance'           => 0,
                    'locked_balance'    => 0,
                    'pending_balance'   => 0,
                    'total_deposits'    => 0,
                    'total_withdrawals' => 0,
                ]
            );

            $buyerWallet->lockForUpdate();

            $correlationId   = Str::uuid();
            $defaultCurrency = $this->currencyService->getDefaultCurrency()->code;

            $paymentAmountDefault = $payment->amount;
            $orderTotalDefault    = $order->default_grand_total ?? $order->grand_total;

            $balanceBefore       = $buyerWallet->balance;
            $balanceAfterDeposit = $balanceBefore + $paymentAmountDefault;
            $balanceAfterPayment = $balanceAfterDeposit - $orderTotalDefault;

            $displayCurrency = $payment->metadata['display_currency'] ?? $order->display_currency;
            $displayAmount   = $payment->metadata['display_amount']   ?? null;

            $basketIdent    = $basket['ident'] ?? $payment->payment_intent_id;
            $tebexPaymentId = $basket['payment']['transaction_id'] ?? null;

            $depositTransaction = Transaction::create([
                'transaction_id'         => generate_transaction_id_hybrid(),
                'correlation_id'         => $correlationId,
                'user_id'                => $payment->user_id,
                'order_id'               => $order->id,
                'type'                   => TransactionType::TOPUP->value,
                'status'                 => TransactionStatus::PAID->value,
                'calculation_type'       => CalculationType::DEBIT->value,
                'amount'                 => $paymentAmountDefault,
                'currency'               => $defaultCurrency,
                'payment_gateway'        => $this->id,
                'gateway_transaction_id' => $basketIdent,
                'source_id'              => $payment->id,
                'source_type'            => Payment::class,
                'fee_amount'             => 0,
                'net_amount'             => $paymentAmountDefault,
                'balance_snapshot'       => $balanceAfterDeposit,
                'metadata'               => [
                    'tebex_basket_ident' => $basketIdent,
                    'tebex_payment_id'   => $tebexPaymentId,
                    'display_amount'     => $displayAmount,
                    'display_currency'   => $displayCurrency,
                    'description'        => "Top-up via Tebex for Order #{$order->order_id}",
                ],
                'notes'        => "Deposit: +{$paymentAmountDefault} {$defaultCurrency} via Tebex",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance'         => $balanceAfterDeposit,
                'total_deposits'  => $buyerWallet->total_deposits + $paymentAmountDefault,
                'last_deposit_at' => now(),
            ]);

            $paymentTransaction = Transaction::create([
                'transaction_id'         => generate_transaction_id_hybrid(),
                'correlation_id'         => $correlationId,
                'user_id'                => $payment->user_id,
                'order_id'               => $order->id,
                'type'                   => TransactionType::PURCHSED->value,
                'status'                 => TransactionStatus::PAID->value,
                'calculation_type'       => CalculationType::CREDIT->value,
                'amount'                 => $orderTotalDefault,
                'currency'               => $defaultCurrency,
                'payment_gateway'        => 'wallet',
                'gateway_transaction_id' => $depositTransaction->transaction_id,
                'source_id'              => $payment->id,
                'source_type'            => Payment::class,
                'fee_amount'             => 0,
                'net_amount'             => $orderTotalDefault,
                'balance_snapshot'       => $balanceAfterPayment,
                'metadata'               => [
                    'tebex_basket_ident' => $basketIdent,
                    'tebex_payment_id'   => $tebexPaymentId,
                    'description'        => "Payment for Order #{$order->order_id}",
                ],
                'notes'        => "Payment: -{$orderTotalDefault} {$defaultCurrency} for Order #{$order->order_id}",
                'processed_at' => now(),
            ]);

            $buyerWallet->update([
                'balance'            => $balanceAfterPayment,
                'total_withdrawals'  => $buyerWallet->total_withdrawals + $orderTotalDefault,
                'last_withdrawal_at' => now(),
            ]);

            $payment->update([
                'status'         => PaymentStatus::COMPLETED->value,
                'transaction_id' => $basketIdent,
                'paid_at'        => now(),
                'metadata'       => array_merge($payment->metadata ?? [], [
                    'tebex_basket_ident'     => $basketIdent,
                    'tebex_payment_id'       => $tebexPaymentId,
                    'deposit_transaction_id' => $depositTransaction->id,
                    'payment_transaction_id' => $paymentTransaction->id,
                    'correlation_id'         => $correlationId,
                ]),
            ]);

            $order->update([
                'status'         => OrderStatus::PAID->value,
                'payment_method' => 'Wallet (via Tebex)',
                'completed_at'   => now(),
            ]);

            $this->updateUserPoints($order);

            Log::info('Tebex regular payment confirmed', [
                'order_id'         => $order->order_id,
                'basket_ident'     => $basketIdent,
                'correlation_id'   => $correlationId,
                'display_currency' => $displayCurrency,
                'display_amount'   => $displayAmount,
                'default_amount'   => $paymentAmountDefault,
                'default_currency' => $defaultCurrency,
            ]);

            $this->dispatchPaymentNotificationsOnce($payment);
            $this->sendOrderMessage($order);

            return ['success' => true, 'message' => 'Payment completed successfully', 'correlation_id' => $correlationId];
        });
    }

    // -------------------------------------------------------------------------
    // Webhook
    // -------------------------------------------------------------------------

    public function handleWebhook(array $payload): void
    {
        $type = $payload['type'] ?? null;
        Log::info('Processing Tebex webhook', ['event_type' => $type]);

        switch ($type) {
            case 'payment.completed':
                $this->handleCheckoutCompleted($payload['subject'] ?? []);
                break;
            case 'payment.declined':
            case 'payment.refunded':
                $this->handlePaymentFailed($payload['subject'] ?? []);
                break;
            default:
                Log::info('Unhandled Tebex webhook event', ['event_type' => $type]);
        }
    }

    protected function handleCheckoutCompleted(array $subject): void
    {
        try {
            $basketIdent = $subject['basket_ident'] ?? $subject['custom']['basket_ident'] ?? null;

            if (! $basketIdent) {
                Log::warning('Tebex webhook: basket ident missing', ['subject' => $subject]);
                return;
            }

            $payment = Payment::where('payment_intent_id', $basketIdent)->with('order')->first();

            if (! $payment || $payment->status === PaymentStatus::COMPLETED->value) {
                return;
            }

            $this->confirmPayment($basketIdent);
        } catch (Exception $e) {
            Log::error('Tebex webhook checkout completed error', ['error' => $e->getMessage()]);
        }
    }

    protected function handlePaymentSuccess(array $subject): void {}

    protected function handlePaymentFailed(array $subject): void
    {
        try {
            $basketIdent = $subject['basket_ident'] ?? null;
            if (! $basketIdent) return;

            $payment = Payment::where('payment_intent_id', $basketIdent)->first();

            if ($payment && $payment->status === PaymentStatus::PENDING->value) {
                $payment->update(['status' => PaymentStatus::FAILED->value]);
                $payment->order?->update(['status' => OrderStatus::FAILED->value, 'payment_status' => 'failed']);
            }
        } catch (Exception $e) {
            Log::error('Tebex handlePaymentFailed error', ['error' => $e->getMessage()]);
        }
    }

    protected function handlePaymentCanceled(array $subject): void {}

    public function requiresFrontendJs(): bool
    {
        return $this->requiresFrontendJs;
    }

    private function markFailed(Payment $payment, Order $order): void
    {
        $payment->update(['status' => PaymentStatus::FAILED->value]);
        $order->update(['status' => OrderStatus::FAILED->value, 'payment_status' => 'failed']);
    }
}
