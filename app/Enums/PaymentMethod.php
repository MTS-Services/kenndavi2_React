<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case STRIPE = 'stripe';
    case PAYPAL = 'paypal';
    case AUTHORIZE_NET = 'authorize_net';
    case BKASH = 'bkash';
    case COD = 'cod';
    case CARD = 'card';

    public function label(): string
    {
        return match ($this) {
            self::STRIPE => __('Stripe'),
            self::PAYPAL => __('PayPal'),
            self::AUTHORIZE_NET => __('Authorize.Net'),
            self::BKASH => __('bKash'),
            self::COD => __('Cash on delivery'),
            self::CARD => __('Card'),
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::STRIPE => 'badge-primary',
            self::PAYPAL => 'badge-primary',
            self::AUTHORIZE_NET => 'badge-primary',
            self::BKASH => 'badge-pink',
            self::COD => 'badge-secondary',
            self::CARD => 'badge-primary',
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
