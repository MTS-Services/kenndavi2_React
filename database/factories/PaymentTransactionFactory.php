<?php

namespace Database\Factories;

use App\Enums\PaymentTransactionStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentTransaction>
 */
class PaymentTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),
            'order_id' => Order::factory(),
            'type' => 'charge',
            'gateway_txn_id' => null,
            'amount' => 100,
            'currency' => 'BDT',
            'status' => PaymentTransactionStatus::PENDING->value,
            'gateway_response' => null,
            'initiated_at' => now(),
            'completed_at' => null,
        ];
    }
}
