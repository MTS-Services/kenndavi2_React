<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['name' => 'Red', 'hex' => '#FF0000'],
            ['name' => 'Blue', 'hex' => '#0000FF'],
            ['name' => 'Green', 'hex' => '#00FF00'],
            ['name' => 'Black', 'hex' => '#000000'],
            ['name' => 'White', 'hex' => '#FFFFFF'],
            ['name' => 'Gray', 'hex' => '#808080'],
            ['name' => 'Yellow', 'hex' => '#FFFF00'],
            ['name' => 'Orange', 'hex' => '#FFA500'],
        ];

        foreach ($colors as $color) {
            Color::updateOrCreate(['name' => $color['name']], $color);
        }
    }
}
