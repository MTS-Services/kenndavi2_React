<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryRelation;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Electronics' => ['Smartphones', 'Laptops', 'Tablets', 'Accessories'],
            'Clothing' => ['Men', 'Women', 'Kids'],
            'Home & Kitchen' => ['Furniture', 'Appliances', 'Decor'],
            'Beauty & Personal Care' => ['Skincare', 'Makeup', 'Fragrance'],
            'Sports & Outdoors' => ['Fitness', 'Camping', 'Cycling'],
        ];

        $index = 1;
        foreach ($categories as $parentTitle => $subs) {
            $parent = Category::factory()->create([
                'title' => $parentTitle,
                'slug' => str($parentTitle)->slug(),
                'sort_order' => $index++,
                'image' => 'https://placehold.co/400x400?text='.urlencode($parentTitle),
            ]);

            foreach ($subs as $subIndex => $subTitle) {
                $sub = Category::factory()->create([
                    'title' => $subTitle,
                    'slug' => str($subTitle)->slug(),
                    'sort_order' => $subIndex + 1,
                    'image' => 'https://placehold.co/400x400?text='.urlencode($subTitle),
                ]);

                CategoryRelation::create([
                    'category_id' => $parent->id,
                    'sub_category_id' => $sub->id,
                    'sort_order' => $subIndex + 1,
                ]);
            }
        }
    }
}
