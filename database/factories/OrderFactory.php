<?php

namespace Database\Factories;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'ORD-'.$this->faker->unique()->numerify('########'),
            'user_id' => User::factory(),
            'shipping_address_id' => ShippingAddress::factory(),
            'subtotal' => 0,
            'discount_amount' => 0,
            'shipping_cost' => 10,
            'tax_amount' => 5,
            'grand_total' => 0,
            'status' => OrderStatus::PENDING->value,
            'payment_status' => OrderPaymentStatus::UNPAID->value,
        ];
    }
}
