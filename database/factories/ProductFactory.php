<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => CategoryFactory::new(),
            'title' => $this->faker->sentence(3),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->optional()->paragraph(),
            'type' => 'men',
            'is_featured' => $this->faker->boolean(10),
            'status' => 'draft',
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}
