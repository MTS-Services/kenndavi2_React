<?php

namespace App\Enums;

enum Gender: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';
    case PREFER_NOT_TO_SAY = 'prefer_not_to_say';

    public function label(): string
    {
        return match ($this) {
            self::MALE => __('Male'),
            self::FEMALE => __('Female'),
            self::OTHER => __('Other'),
            self::PREFER_NOT_TO_SAY => __('Prefer not to say'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::MALE => 'badge-primary',
            self::FEMALE => 'badge-pink',
            self::OTHER => 'badge-secondary',
            self::PREFER_NOT_TO_SAY => 'badge-muted',
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
