<?php

namespace App\Http\Payment;

use App\Enums\PointType;
use App\Events\PaymentSuccessEvent;
use App\Models\Achievement;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\PointLog;
use App\Models\UserAchievementProgress;
use App\Models\UserPoint;
use App\Services\AchievementService;
use App\Services\ConversationService;
use Illuminate\Support\Facades\Log;

abstract class PaymentMethod
{
    protected $name;

    protected ?PaymentGateway $gateway;

    protected ConversationService $conversationService;

    protected $requiresFrontendJs = false;

    protected $jsSDKUrl = null;

    protected AchievementService $achievementService;

    public function __construct(?PaymentGateway $gateway, ConversationService $conversationService, AchievementService $achievementService)
    {
        $this->gateway = $gateway;
        $this->conversationService = $conversationService;
        $this->achievementService = $achievementService;
    }

    abstract public function startPayment(Order $order, array $paymentData = []);

    public function confirmPayment(string $transactionId, ?string $paymentMethodId = null): array
    {
        return [
            'success' => false,
            'message' => __('This payment method does not support confirmation.'),
        ];
    }

    protected function dispatchPaymentNotificationsOnce(Payment $payment): void
    {
        try {
            // Ensure order relationship is loaded
            $payment->loadMissing('order');

            if (! $payment->order) {
                Log::warning('Cannot dispatch notifications - order not found', [
                    'payment_id' => $payment->payment_id,
                ]);

                return;
            }

            // Dispatch event to trigger notifications
            event(new PaymentSuccessEvent($payment->order, $payment));

            Log::info('Payment notification event dispatched', [
                'payment_id' => $payment->payment_id,
                'order_id' => $payment->order->order_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to dispatch payment notifications', [
                'payment_id' => $payment->payment_id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected function sendOrderMessage(Order $order): void
    {
        $this->conversationService->sendOrderMessage($order);
    }

    public function handleWebhook(array $payload): void
    {
        // Override in child class if webhook support is needed
    }

    public function updateOrder(Order $order, array $updatedData): bool
    {
        return $order->update($updatedData);
    }

    public function requiresFrontendJs(): bool
    {
        return $this->requiresFrontendJs;
    }

    public function getJsSDKUrl(): ?string
    {
        return $this->jsSDKUrl;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getGateway(): ?PaymentGateway
    {
        return $this->gateway;
    }

    public function updateUserPoints(Order $order)
    {
        $pointLogs = PointLog::create([
            'user_id' => $order->user_id,
            'source_id' => $order->id,
            'source_type' => Order::class,
            'type' => PointType::EARNED->value,
            'points' => $order->points,
            'notes' => "Points earned for Order #{$order->order_id}",
        ]);

        $userPoint = UserPoint::firstOrNew(['user_id' => $order->user_id]);
        $userPoint->points += $pointLogs->points;
        $userPoint->save();
        Log::info('User points updated', [
            'user_id' => $order->user_id,
            'points' => $pointLogs->points,
        ]);

        $achievement = $this->achievementService->nextOrProgressAchievement(1, user()->id);

        if (! $achievement == null && $achievement->achievement_type_id == 1) {

            $progress = UserAchievementProgress::firstOrCreate(
                [
                    'user_id' => user()->id,
                    'achievement_id' => $achievement->id,
                ],
                [
                    'current_progress' => 0,
                ]
            );
            $progress->increment('current_progress');

            // ✅ Mark as completed
            if ($progress->current_progress >= $achievement->target_value) {

                $pointLogs = PointLog::create([
                    'user_id' => user()->id,
                    'source_id' => $achievement->id,
                    'source_type' => Achievement::class,
                    'type' => PointType::REWARD->value,
                    'points' => $achievement->point_reward,
                    'notes' => "Points reward for Achievement #{$achievement->id}",
                ]);

                $userPoint = UserPoint::firstOrNew(['user_id' => user()->id]);
                $userPoint->points += $pointLogs->points;
                $userPoint->save();

                $progress->achieved_at = now();
                Log::info('User points updated', [
                    'user_id' => user()->id,
                    'points' => $pointLogs->points,
                ]);

            }
            $progress->save();
        }

        $achievement = $this->achievementService->nextOrProgressAchievement(3, user()->id);

        if (! $achievement == null && $achievement->achievement_type_id == 3) {

            $progress = UserAchievementProgress::firstOrCreate(
                [
                    'user_id' => user()->id,
                    'achievement_id' => $achievement->id,
                ],
                [
                    'current_progress' => 0,
                ]
            );
            $progress->increment('current_progress');

            // ✅ Mark as completed
            if ($progress->current_progress >= $achievement->target_value) {

                $pointLogs = PointLog::create([
                    'user_id' => user()->id,
                    'source_id' => $achievement->id,
                    'source_type' => Achievement::class,
                    'type' => PointType::REWARD->value,
                    'points' => $achievement->point_reward,
                    'notes' => "Points reward for Achievement #{$achievement->id}",
                ]);

                $userPoint = UserPoint::firstOrNew(['user_id' => user()->id]);
                $userPoint->points += $pointLogs->points;
                $userPoint->save();

                $progress->achieved_at = now();
                Log::info('User points updated', [
                    'user_id' => user()->id,
                    'points' => $pointLogs->points,
                ]);

            }
            $progress->save();
        }

    }
}
