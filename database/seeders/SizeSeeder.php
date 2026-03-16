<?php

namespace Database\Seeders;

use App\Models\Size;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sizes = [
            ['name' => 'S', 'sort_order' => 1],
            ['name' => 'M', 'sort_order' => 2],
            ['name' => 'L', 'sort_order' => 3],
            ['name' => 'XL', 'sort_order' => 4],
            ['name' => 'XXL', 'sort_order' => 5],
        ];

        foreach ($sizes as $index => $size) {
            Size::updateOrCreate(['name' => $size['name']], array_merge($size, ['sort_order' => $index + 1]));
        }
    }
}
