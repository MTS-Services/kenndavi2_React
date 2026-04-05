<?php

namespace App\Enums;

enum MethodModeStatus: string
{
    case LIVE = 'live';
    case SANDBOX = 'sandbox';

    public function label(): string
    {
        return match ($this) {
            self::LIVE => __('Live'),
            self::SANDBOX => __('Sandbox'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::LIVE => 'badge-success',
            self::SANDBOX => 'badge-warning',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn ($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
