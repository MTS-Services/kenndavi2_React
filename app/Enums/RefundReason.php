<?php

namespace App\Enums;

enum RefundReason: string
{
    case DEFECTIVE = 'defective';
    case WRONG_ITEM = 'wrong_item';
    case CUSTOMER_REQUEST = 'customer_request';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::DEFECTIVE => __('Defective'),
            self::WRONG_ITEM => __('Wrong item'),
            self::CUSTOMER_REQUEST => __('Customer request'),
            self::OTHER => __('Other'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DEFECTIVE => 'badge-danger',
            self::WRONG_ITEM => 'badge-warning',
            self::CUSTOMER_REQUEST => 'badge-info',
            self::OTHER => 'badge-secondary',
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
