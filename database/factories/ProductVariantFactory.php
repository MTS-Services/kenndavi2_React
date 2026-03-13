<?php

namespace Database\Factories;

use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => ProductFactory::new(),
            'color_id' => ColorFactory::new(),
            'size_id' => SizeFactory::new(),
            'price' => $this->faker->randomFloat(2, 10, 200),
            'offer_price' => null,
            'offer_percent' => null,
            'offer_starts_at' => null,
            'offer_ends_at' => null,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'status' => 'active',
        ];
    }
}
