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
            ['name' => 'S', 'code' => 'S', 'type' => 'alpha'],
            ['name' => 'M', 'code' => 'M', 'type' => 'alpha'],
            ['name' => 'L', 'code' => 'L', 'type' => 'alpha'],
            ['name' => 'XL', 'code' => 'XL', 'type' => 'alpha'],
            ['name' => 'XXL', 'code' => 'XXL', 'type' => 'alpha'],
        ];

        foreach ($sizes as $index => $size) {
            Size::updateOrCreate(['code' => $size['code']], array_merge($size, ['sort_order' => $index + 1]));
        }
    }
}
