<?php

namespace App\Enums;

enum OrderStatus: string
{
    case INITIALIZED = 'initialized';
    case PENDING = 'pending';
    case FAILED = 'failed';
    case CONFIRMED = 'confirmed';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';
    case RETURNED = 'returned';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::INITIALIZED => __('Initialized'),
            self::PENDING => __('Pending'),
            self::FAILED => __('Failed'),
            self::CONFIRMED => __('Confirmed'),
            self::PROCESSING => __('Processing'),
            self::SHIPPED => __('Shipped'),
            self::DELIVERED => __('Delivered'),
            self::CANCELLED => __('Cancelled'),
            self::REFUNDED => __('Refunded'),
            self::RETURNED => __('Returned'),
            self::COMPLETED => __('Completed'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::INITIALIZED => 'badge-secondary',
            self::PENDING => 'badge-warning',
            self::FAILED => 'badge-danger',
            self::CONFIRMED => 'badge-info',
            self::PROCESSING => 'badge-info',
            self::SHIPPED => 'badge-primary',
            self::DELIVERED => 'badge-success',
            self::CANCELLED => 'badge-danger',
            self::REFUNDED => 'badge-purple',
            self::RETURNED => 'badge-secondary',
            self::COMPLETED => 'badge-success',
        };
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn(self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
            ],
            self::cases(),
        );
    }
}
