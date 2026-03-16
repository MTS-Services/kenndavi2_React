<?php

namespace App\Enums;

enum OrderPaymentStatus: string
{
    case UNPAID = 'unpaid';
    case PAID = 'paid';
    case PARTIALLY_REFUNDED = 'partially_refunded';
    case FULLY_REFUNDED = 'fully_refunded';

    public function label(): string
    {
        return match ($this) {
            self::UNPAID => __('Unpaid'),
            self::PAID => __('Paid'),
            self::PARTIALLY_REFUNDED => __('Partially refunded'),
            self::FULLY_REFUNDED => __('Fully refunded'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::UNPAID => 'badge-warning',
            self::PAID => 'badge-success',
            self::PARTIALLY_REFUNDED => 'badge-info',
            self::FULLY_REFUNDED => 'badge-purple',
        };
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
            ],
            self::cases(),
        );
    }
}
