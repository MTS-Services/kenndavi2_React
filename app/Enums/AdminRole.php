<?php

namespace App\Enums;

enum AdminRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case STAFF = 'staff';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => __('Super admin'),
            self::ADMIN => __('Admin'),
            self::STAFF => __('Staff'),
            self::CUSTOMER => __('Customer'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'badge-danger',
            self::ADMIN => 'badge-primary',
            self::STAFF => 'badge-info',
            self::CUSTOMER => 'badge-secondary',
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
