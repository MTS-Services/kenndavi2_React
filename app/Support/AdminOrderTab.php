<?php

namespace App\Support;

use App\Enums\OrderStatus;

final class AdminOrderTab
{
    public const PENDING = 'pending';

    public const SHIPPED = 'shipped';

    public const DELIVERED = 'delivered';

    public const CANCELLED = 'cancelled';

    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return [
            self::PENDING,
            self::SHIPPED,
            self::DELIVERED,
            self::CANCELLED,
        ];
    }

    public static function normalize(?string $tab): string
    {
        $tab = $tab ?? self::PENDING;

        return in_array($tab, self::keys(), true) ? $tab : self::PENDING;
    }

    /**
     * @return list<OrderStatus>
     */
    public static function statusesForTab(string $tab): array
    {
        return match (self::normalize($tab)) {
            self::PENDING => [
                OrderStatus::PENDING,
                OrderStatus::CONFIRMED,
            ],
            self::SHIPPED => [OrderStatus::SHIPPED],
            self::DELIVERED => [
                OrderStatus::DELIVERED,
                OrderStatus::COMPLETED,
            ],
            self::CANCELLED => [
                OrderStatus::CANCELLED,
                OrderStatus::FAILED,
                OrderStatus::REFUNDED,
                OrderStatus::RETURNED,
            ],
            default => [
                OrderStatus::INITIALIZED,
                OrderStatus::PENDING,
                OrderStatus::CONFIRMED,
                OrderStatus::PROCESSING,
            ],
        };
    }

    /**
     * @return list<string>
     */
    public static function statusValuesForTab(string $tab): array
    {
        return array_map(
            fn (OrderStatus $s) => $s->value,
            self::statusesForTab($tab),
        );
    }

    /**
     * Map stored order status to one of the four admin list UI buckets (badges / tabs).
     */
    public static function uiBucketForStatus(OrderStatus $status): string
    {
        if (in_array($status, self::statusesForTab(self::PENDING), true)) {
            return self::PENDING;
        }

        if (in_array($status, self::statusesForTab(self::SHIPPED), true)) {
            return self::SHIPPED;
        }

        if (in_array($status, self::statusesForTab(self::DELIVERED), true)) {
            return self::DELIVERED;
        }

        return self::CANCELLED;
    }
}
