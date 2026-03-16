<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'New Arrival', 'Best Seller', 'Sale', 'Limited Edition', 'Eco Friendly', 'Premium',
        ];

        foreach ($tags as $tag) {
            Tag::updateOrCreate(['name' => $tag], [
                'name' => $tag,
                'slug' => str($tag)->slug(),
            ]);
        }
    }
}
