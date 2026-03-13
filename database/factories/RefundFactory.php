<?php

namespace Database\Factories;

use App\Models\Refund;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Refund>
 */
class RefundFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => OrderFactory::new(),
            'order_item_id' => null,
            'payment_transaction_id' => PaymentTransactionFactory::new(),
            'amount' => 50,
            'reason' => 'customer_request',
            'note' => $this->faker->optional()->sentence(),
            'status' => 'pending',
            'refunded_by' => null,
            'processed_at' => null,
        ];
    }
}
