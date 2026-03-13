<?php

namespace Database\Factories;

use App\Models\Category;
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
        $title = $this->faker->randomElement([
            'Classic Cotton T-Shirt', 'Smartphone 5G Pro', 'Designer Leather Bag',
            'Wireless Noise Cancelling Headphones', 'Eco-Friendly Yoga Mat',
            'Sleek Smartwatch X', 'Gourmet Coffee Beans', 'Ergonomic Office Chair',
            'Premium Running Shoes', 'Modern Ceramic Vase', 'Vintage Style Watch',
            'Portable Bluetooth Speaker', 'High Performance Laptop', 'Designer Sunglasses',
            'Silk Scarf Collection', 'Luxury Face Cream', 'Cotton Bath Towels',
            'Professional DSLR Camera', 'Compact Coffee Maker', 'Minimalist Desk Lamp'
        ]);

        return [
            'category_id' => Category::factory(),
            'title' => $title . ' ' . $this->faker->unique()->word(),
            'slug' => str($title)->slug() . '-' . $this->faker->unique()->slug(),
            'description' => $this->faker->paragraphs(2, true),
            'type' => $this->faker->randomElement(['men', 'women', 'accesories']),
            'is_featured' => $this->faker->boolean(20),
            'status' => 'active',
            'sort_order' => $this->faker->numberBetween(0, 100),
        ];
    }
}
