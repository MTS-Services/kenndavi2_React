<?php

namespace Database\Factories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
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
            'variant_id' => null,
            'product_title' => $this->faker->sentence(3),
            'sku' => strtoupper($this->faker->bothify('SKU-#####')),
            'color_name' => $this->faker->word(),
            'size_name' => $this->faker->randomElement(['S', 'M', 'L']),
            'image_url' => $this->faker->imageUrl(),
            'unit_price' => 100,
            'offer_price' => null,
            'quantity' => 1,
            'total_price' => 100,
        ];
    }
}
