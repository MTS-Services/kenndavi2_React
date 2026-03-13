<?php

namespace Database\Factories;

use App\Models\Order;
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
            'user_id' => null,
            'shipping_address_id' => ShippingAddressFactory::new(),
            'subtotal' => 100,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'tax_amount' => 0,
            'grand_total' => 100,
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ];
    }
}
