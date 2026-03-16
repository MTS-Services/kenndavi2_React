<?php

namespace App\Enums;

enum ProductType: string
{
    case MEN = 'men';
    case WOMEN = 'women';
    case ACCESSORIES = 'accesories';

    public function label(): string
    {
        return match ($this) {
            self::MEN => __('Men'),
            self::WOMEN => __('Women'),
            self::ACCESSORIES => __('Accessories'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::MEN => 'badge-primary',
            self::WOMEN => 'badge-pink',
            self::ACCESSORIES => 'badge-secondary',
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
