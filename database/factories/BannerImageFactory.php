<?php

namespace Database\Factories;

use App\Models\Banner;
use App\Models\BannerImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BannerImage>
 */
class BannerImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'banner_id' => Banner::factory(),
            'url' => "https://placehold.co/1920x600?text=Banner+Image",
            'alt_text' => $this->faker->sentence(3),
        ];
    }
}
