<?php

namespace Database\Factories;

use App\Models\Color;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Color>
 */
class ColorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sort_order' => $this->faker->numberBetween(0, 10),
            'name' => $this->faker->unique()->safeColorName(),
            'hex_code' => sprintf('#%06X', $this->faker->numberBetween(0, 0xFFFFFF)),
        ];
    }
}
