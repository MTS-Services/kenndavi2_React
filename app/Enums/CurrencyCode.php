<?php

namespace App\Enums;

enum CurrencyCode: string
{
    case USD = 'USD';
    case BDT = 'BDT';
    case EUR = 'EUR';
    case GBP = 'GBP';

    public function label(): string
    {
        return match ($this) {
            self::USD => __('US Dollar'),
            self::BDT => __('Bangladeshi Taka'),
            self::EUR => __('Euro'),
            self::GBP => __('British Pound'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::USD => 'badge-primary',
            self::BDT => 'badge-success',
            self::EUR => 'badge-info',
            self::GBP => 'badge-secondary',
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
