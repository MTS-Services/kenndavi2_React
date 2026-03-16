<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImage>
 */
class ProductImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'color_id' => null,
            'url' => "https://placehold.co/800x1000?text=Product+Image",
            'alt_text' => $this->faker->sentence(3),
            'is_primary' => $this->faker->boolean(20),
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}
