<?php

namespace App\Enums;

enum VariantStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case OUT_OF_STOCK = 'out_of_stock';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => __('Active'),
            self::INACTIVE => __('Inactive'),
            self::OUT_OF_STOCK => __('Out of stock'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ACTIVE => 'badge-success',
            self::INACTIVE => 'badge-secondary',
            self::OUT_OF_STOCK => 'badge-danger',
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
