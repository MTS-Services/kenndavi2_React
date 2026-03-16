<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Admin;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Size;
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
            'product_id' => Product::factory(),
            'color_id' => Color::factory(),
            'size_id' => Size::factory(),
            'quantity' => $this->faker->numberBetween(0, 1000),
            'status' => ProductStatus::ACTIVE->value,
            'created_by' => Admin::factory(),
            'updated_by' => Admin::factory(),
        ];
    }

    /**
     * Indicate that the variant is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => 0,
        ]);
    }
}
