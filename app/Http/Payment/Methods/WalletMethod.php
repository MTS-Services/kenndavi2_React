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
use Illuminate\Support\Str;

class WalletMethod extends PaymentMethod
{
    protected $id = 'wallet';

    protected $name = 'Wallet';

    protected $requiresFrontendJs = false;

    protected CurrencyService $currencyService;

    protected AchievementService $achievementService;

    public function __construct($gateway, ConversationService $conversationService, AchievementService $achievementService)
    {
        parent::__construct($gateway, $conversationService, $achievementService);
        $this->currencyService = app(CurrencyService::class);
        $this->achievementService = $achievementService;
    }

    /**
     * Start payment - Direct wallet payment (Scenario 1)
     * Wallet is ALWAYS in default currency (USD)
     * Order amounts need to be converted to default currency
     */
    public function startPayment(Order $order, array $paymentData = []): array
    {
        try {
            // Get or create wallet (always in default currency)
            $defaultCurrency = $this->currencyService->getDefaultCurrency();
            $wallet = Wallet::firstOrCreate(
                ['user_id' => $order->user_id],
                [
                    'currency_code' => $defaultCurrency->code,
                    'balance' => 0,
                    'locked_balance' => 0,
                    'pending_balance' => 0,
                    'total_deposits' => 0,
                    'total_withdrawals' => 0,
                ]
            );

            // Get order amount in DEFAULT currency (for wallet calculation)
            // Use dynamically calculated amount from checkout if available
            $orderAmountDefault = $paymentData['grand_total_default'] ?? $order->default_grand_total ?? $order->grand_total;

            // Get display currency info (for logging and display)
            $displayCurrency = $paymentData['display_currency'] ?? $order->display_currency ?? $order->currency;
            $orderAmountDisplay = $paymentData['grand_total'] ?? $order->grand_total;

            // Validate sufficient balance (in default currency)
            if ($wallet->balance < $orderAmountDefault) {
                // Convert amounts to display currency for user-friendly message
                $walletBalanceDisplay = $this->currencyService->convertFromDefault(
                    $wallet->balance,
                    $displayCurrency
                );
                $requiredAmountDisplay = $this->currencyService->convertFromDefault(
                    $orderAmountDefault,
                    $displayCurrency
                );

                $displaySymbol = $this->currencyService->getCurrentCurrencySymbol();

                return [
                    'success' => false,
                    'message' => __('Insufficient wallet balance. Your balance: :symbol :balance :currency', [
                        'symbol' => $displaySymbol,
                        'balance' => number_format($walletBalanceDisplay, 2),
                        'currency' => $displayCurrency,
                    ]),
                    'current_balance' => $wallet->balance,
                    'current_balance_display' => $walletBalanceDisplay,
                    'required_amount' => $orderAmountDefault,
                    'required_amount_display' => $requiredAmountDisplay,
                    'display_currency' => $displayCurrency,
                ];
            }

            $order->load('user');

            return DB::transaction(function () use ($order, $wallet, $orderAmountDefault, $displayCurrency, $orderAmountDisplay, $defaultCurrency) {
                // Lock wallet to prevent race conditions
                $wallet->lockForUpdate();
                $order->lockForUpdate();

                $balanceBefore = $wallet->balance;
                $balanceAfter = $balanceBefore - $orderAmountDefault;
                $correlationId = Str::uuid();

                // ===================================================
                // SINGLE TRANSACTION: PAYMENT (Direct from wallet)
                // Type: PURCHASED, Calculation: CREDIT (money OUT)
                // Amount: ALWAYS in default currency
                // ===================================================

                // 1. Create payment record (in default currency)
                $payment = Payment::create([
                    'payment_id' => generate_payment_id(),
                    'user_id' => $order->user_id,
                    'name' => $order->user->full_name ?? null,
                    'email_address' => $order->user->email ?? null,
                    'payment_gateway' => $this->id,
                    'amount' => $orderAmountDefault, // Default currency
                    'currency' => $defaultCurrency->code,
                    'status' => PaymentStatus::COMPLETED->value,
                    'order_id' => $order->id,
                    'paid_at' => now(),
                    'transaction_id' => null, // Will be set below
                    'metadata' => [
                        'wallet_payment' => true,
                        'balance_before' => $balanceBefore,
                        'balance_after' => $balanceAfter,
                        'correlation_id' => $correlationId,
                        'display_currency' => $displayCurrency,
                        'display_amount' => $orderAmountDisplay,
                        'default_currency' => $defaultCurrency->code,
                        'default_amount' => $orderAmountDefault,
                    ],
                    'creater_id' => $order->user_id,
                    'creater_type' => get_class($order->user),
                ]);

                // 2. Create transaction record (CREDIT - money OUT, in default currency)
                $paymentTransaction = Transaction::create([
                    'transaction_id' => generate_transaction_id_hybrid(),
                    'correlation_id' => $correlationId,
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'type' => TransactionType::PURCHSED->value,
                    'status' => TransactionStatus::PAID->value,
                    'calculation_type' => CalculationType::CREDIT->value,
                    'amount' => $orderAmountDefault, // Default currency
                    'currency' => $defaultCurrency->code,
                    'payment_gateway' => $this->id,
                    'gateway_transaction_id' => null, // Will be self-referencing
                    'source_id' => $payment->id,
                    'source_type' => Payment::class,
                    'fee_amount' => 0,
                    'net_amount' => $orderAmountDefault,
                    'balance_snapshot' => $balanceAfter,
                    'metadata' => [
                        'payment_id' => $payment->payment_id,
                        'wallet_payment' => true,
                        'display_currency' => $displayCurrency,
                        'display_amount' => $orderAmountDisplay,
                        'description' => "Payment for Order #{$order->order_id}",
                    ],
                    'notes' => "Payment: -{$orderAmountDefault} {$defaultCurrency->code} for Order #{$order->order_id}",
                    'processed_at' => now(),
                ]);
                // Update payment with transaction_id
                $payment->update([
                    'transaction_id' => $paymentTransaction->transaction_id,
                ]);

                // Update transaction with self-referencing gateway_transaction_id
                $paymentTransaction->update([
                    'gateway_transaction_id' => $paymentTransaction->transaction_id,
                ]);

                // 3. Update wallet balance (in default currency)
                $wallet->update([
                    'balance' => $balanceAfter,
                    'total_withdrawals' => $wallet->total_withdrawals + $orderAmountDefault,
                    'last_withdrawal_at' => now(),
                ]);

                $this->updateUserPoints($order);

                // 4. Update order status
                $order->update([
                    'status' => OrderStatus::PAID->value,
                    'payment_method' => $this->name,
                    'paid_at' => now(),
                ]);

                Log::info('Direct wallet payment processed with currency handling', [
                    'order_id' => $order->order_id,
                    'payment_id' => $payment->payment_id,
                    'transaction_id' => $paymentTransaction->transaction_id,
                    'correlation_id' => $correlationId,
                    'default_amount' => $orderAmountDefault,
                    'default_currency' => $defaultCurrency->code,
                    'display_amount' => $orderAmountDisplay,
                    'display_currency' => $displayCurrency,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                ]);

                $this->dispatchPaymentNotificationsOnce($payment);
                $this->sendOrderMessage($order);

                // Convert balance to display currency for user message
                $balanceAfterDisplay = $this->currencyService->convertFromDefault(
                    $balanceAfter,
                    $displayCurrency
                );
                $displaySymbol = $this->currencyService->getCurrentCurrencySymbol();

                return [
                    'success' => true,
                    'message' => __('Payment successful! Amount deducted from your wallet. New balance: :symbol :balance :currency', [
                        'symbol' => $displaySymbol,
                        'balance' => number_format($balanceAfterDisplay, 2),
                        'currency' => $displayCurrency,
                    ]),
                    'payment_id' => $payment->payment_id,
                    'transaction_id' => $paymentTransaction->transaction_id,
                    'correlation_id' => $correlationId,
                    'order_id' => $order->order_id,
                    'amount_paid' => $orderAmountDefault,
                    'amount_paid_display' => $orderAmountDisplay,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'balance_after_display' => $balanceAfterDisplay,
                    'currency' => $defaultCurrency->code,
                    'display_currency' => $displayCurrency,
                    'redirect_url' => route('user.payment.success', ['order_id' => $order->order_id]),
                ];
            });
        } catch (Exception $e) {
            Log::error('Wallet payment failed', [
                'order_id' => $order->order_id,
                'user_id' => $order->user_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => __('Wallet payment failed: :message', ['message' => $e->getMessage()]),
            ];
        }
    }

    /**
     * Confirm payment - Not needed for direct wallet payments
     */
    public function confirmPayment(string $transactionId, ?string $paymentMethodId = null): array
    {
        return [
            'success' => true,
            'message' => __('Wallet payment is processed immediately.'),
        ];
    }

    /**
     * Get wallet balance for a user (in default currency)
     * Optionally convert to display currency
     */
    public function getWalletBalance(int $userId, ?string $displayCurrency = null): array
    {
        $wallet = Wallet::where('user_id', $userId)->first();
        $defaultCurrency = $this->currencyService->getDefaultCurrency();

        if (! $wallet) {
            $balanceDefault = 0;
            $currencyCode = $defaultCurrency->code;
        } else {
            $balanceDefault = $wallet->balance;
            $currencyCode = $wallet->currency_code;
        }

        // If display currency specified, convert
        if ($displayCurrency && $displayCurrency !== $defaultCurrency->code) {
            $balanceDisplay = $this->currencyService->convertFromDefault(
                $balanceDefault,
                $displayCurrency
            );
            $displaySymbol = $this->currencyService->getCurrentCurrencySymbol();
        } else {
            $balanceDisplay = $balanceDefault;
            $displayCurrency = $defaultCurrency->code;
            $displaySymbol = $defaultCurrency->symbol;
        }

        return [
            // Default currency info (for calculations)
            'balance' => $balanceDefault,
            'currency_code' => $currencyCode,
            'formatted_balance' => number_format($balanceDefault, 2).' '.$currencyCode,

            // Display currency info (for UI)
            'balance_display' => $balanceDisplay,
            'display_currency' => $displayCurrency,
            'display_symbol' => $displaySymbol,
            'formatted_balance_display' => $displaySymbol.number_format($balanceDisplay, 2).' '.$displayCurrency,

            // Additional wallet info
            'locked_balance' => $wallet->locked_balance ?? 0,
            'pending_balance' => $wallet->pending_balance ?? 0,
            'total_deposits' => $wallet->total_deposits ?? 0,
            'total_withdrawals' => $wallet->total_withdrawals ?? 0,
        ];
    }

    /**
     * Check if user has sufficient balance
     * Amount should be in DEFAULT currency
     */
    public function hasSufficientBalance(int $userId, float $amountDefault): bool
    {
        $wallet = Wallet::where('user_id', $userId)->first();

        if (! $wallet) {
            return false;
        }

        return $wallet->balance >= $amountDefault;
    }

    /**
     * Check if user has sufficient balance with display info
     * Useful for showing user-friendly messages
     */
    public function checkSufficientBalanceWithDisplay(int $userId, float $amountDefault, ?string $displayCurrency = null): array
    {
        $wallet = Wallet::where('user_id', $userId)->first();
        $defaultCurrency = $this->currencyService->getDefaultCurrency();

        $walletBalance = $wallet ? $wallet->balance : 0;
        $hasSufficient = $walletBalance >= $amountDefault;
        $shortage = max(0, $amountDefault - $walletBalance);

        // Convert to display currency if specified
        if ($displayCurrency && $displayCurrency !== $defaultCurrency->code) {
            $walletBalanceDisplay = $this->currencyService->convertFromDefault($walletBalance, $displayCurrency);
            $amountDisplay = $this->currencyService->convertFromDefault($amountDefault, $displayCurrency);
            $shortageDisplay = $this->currencyService->convertFromDefault($shortage, $displayCurrency);
            $displaySymbol = $this->currencyService->getCurrentCurrencySymbol();
        } else {
            $walletBalanceDisplay = $walletBalance;
            $amountDisplay = $amountDefault;
            $shortageDisplay = $shortage;
            $displayCurrency = $defaultCurrency->code;
            $displaySymbol = $defaultCurrency->symbol;
        }

        return [
            'has_sufficient' => $hasSufficient,

            // Default currency
            'balance' => $walletBalance,
            'required_amount' => $amountDefault,
            'shortage' => $shortage,
            'currency' => $defaultCurrency->code,

            // Display currency
            'balance_display' => $walletBalanceDisplay,
            'required_amount_display' => $amountDisplay,
            'shortage_display' => $shortageDisplay,
            'display_currency' => $displayCurrency,
            'display_symbol' => $displaySymbol,

            // Formatted strings
            'formatted_balance' => $displaySymbol.number_format($walletBalanceDisplay, 2),
            'formatted_required' => $displaySymbol.number_format($amountDisplay, 2),
            'formatted_shortage' => $displaySymbol.number_format($shortageDisplay, 2),
        ];
    }

    /**
     * Get available balance (excluding locked amounts)
     * Returns in default currency
     */
    public function getAvailableBalance(int $userId): float
    {
        $wallet = Wallet::where('user_id', $userId)->first();

        if (! $wallet) {
            return 0;
        }

        return $wallet->balance - $wallet->locked_balance;
    }

    /**
     * Get available balance with display conversion
     */
    public function getAvailableBalanceWithDisplay(int $userId, ?string $displayCurrency = null): array
    {
        $wallet = Wallet::where('user_id', $userId)->first();
        $defaultCurrency = $this->currencyService->getDefaultCurrency();

        if (! $wallet) {
            $availableBalance = 0;
        } else {
            $availableBalance = $wallet->balance - $wallet->locked_balance;
        }

        // Convert to display currency if needed
        if ($displayCurrency && $displayCurrency !== $defaultCurrency->code) {
            $availableBalanceDisplay = $this->currencyService->convertFromDefault(
                $availableBalance,
                $displayCurrency
            );
            $displaySymbol = $this->currencyService->getCurrentCurrencySymbol();
        } else {
            $availableBalanceDisplay = $availableBalance;
            $displayCurrency = $defaultCurrency->code;
            $displaySymbol = $defaultCurrency->symbol;
        }

        return [
            'available_balance' => $availableBalance,
            'available_balance_display' => $availableBalanceDisplay,
            'currency' => $defaultCurrency->code,
            'display_currency' => $displayCurrency,
            'display_symbol' => $displaySymbol,
            'formatted' => $displaySymbol.number_format($availableBalanceDisplay, 2),
        ];
    }

    /**
     * Add funds to wallet (top-up)
     * Amount should be in DEFAULT currency
     */
    public function addFunds(int $userId, float $amountDefault, string $source = 'manual', array $metadata = []): array
    {
        try {
            $defaultCurrency = $this->currencyService->getDefaultCurrency();

            $wallet = Wallet::firstOrCreate(
                ['user_id' => $userId],
                [
                    'currency_code' => $defaultCurrency->code,
                    'balance' => 0,
                    'locked_balance' => 0,
                    'pending_balance' => 0,
                    'total_deposits' => 0,
                    'total_withdrawals' => 0,
                ]
            );

            return DB::transaction(function () use ($wallet, $amountDefault, $source, $metadata, $defaultCurrency, $userId) {
                $wallet->lockForUpdate();

                $balanceBefore = $wallet->balance;
                $balanceAfter = $balanceBefore + $amountDefault;

                // Update wallet
                $wallet->update([
                    'balance' => $balanceAfter,
                    'total_deposits' => $wallet->total_deposits + $amountDefault,
                    'last_deposit_at' => now(),
                ]);

                // Create transaction record
                $transaction = Transaction::create([
                    'transaction_id' => generate_transaction_id_hybrid(),
                    'user_id' => $userId,
                    'type' => TransactionType::TOPUP->value,
                    'status' => TransactionStatus::PAID->value,
                    'calculation_type' => CalculationType::DEBIT->value,
                    'amount' => $amountDefault,
                    'currency' => $defaultCurrency->code,
                    'payment_gateway' => $source,
                    'balance_snapshot' => $balanceAfter,
                    'metadata' => array_merge([
                        'source' => $source,
                        'balance_before' => $balanceBefore,
                        'balance_after' => $balanceAfter,
                    ], $metadata),
                    'notes' => "Wallet top-up: +{$amountDefault} {$defaultCurrency->code}",
                    'processed_at' => now(),
                ]);

                Log::info('Funds added to wallet', [
                    'user_id' => $userId,
                    'amount' => $amountDefault,
                    'source' => $source,
                    'balance_after' => $balanceAfter,
                    'transaction_id' => $transaction->transaction_id,
                ]);

                return [
                    'success' => true,
                    'message' => __('Funds added successfully'),
                    'transaction_id' => $transaction->transaction_id,
                    'amount' => $amountDefault,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to add funds to wallet', [
                'user_id' => $userId,
                'amount' => $amountDefault,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => __('Failed to add funds: :message', ['message' => $e->getMessage()]),
            ];
        }
    }
}
