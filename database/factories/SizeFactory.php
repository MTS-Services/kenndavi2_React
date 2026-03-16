<?php

namespace Database\Factories;

use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Size>
 */
class SizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['S', 'M', 'L', 'XL']),
            'code' => $this->faker->unique()->bothify('SIZE-##'),
            'type' => 'alpha',
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}
