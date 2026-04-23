<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
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
            'method' => 'cod',
            'txn_id' => (string) Str::uuid(),
            'gateway_txn_id' => null,
            'amount' => 100,
            'currency' => 'USD',
            'status' => 'pending',
            'paid_at' => null,
            'gateway_response' => null,
        ];
    }
}
