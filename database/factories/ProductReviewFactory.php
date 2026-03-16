<?php

namespace Database\Factories;

use App\Models\ProductReview;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductReview>
 */
class ProductReviewFactory extends Factory
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
            'user_id' => null,
            'order_item_id' => null,
            'rating' => $this->faker->numberBetween(1, 5),
            'title' => $this->faker->sentence(3),
            'comment' => $this->faker->optional()->paragraph(),
            'is_verified' => false,
            'helpful_count' => 0,
            'status' => 'pending',
        ];
    }
}
