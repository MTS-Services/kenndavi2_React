<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->randomElement([
            'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Personal Care',
            'Sports & Outdoors', 'Books', 'Toys & Games', 'Automotive',
        ]);

        return [
            'sort_order' => $this->faker->numberBetween(0, 10),
            'title' => $title.' '.$this->faker->unique()->word(),
            'slug' => str($title)->slug().'-'.$this->faker->unique()->slug(),
            'image' => 'https://placehold.co/400x400?text='.urlencode($title),
            'description' => $this->faker->sentence(),
            'status' => 'active',
        ];
    }
}
