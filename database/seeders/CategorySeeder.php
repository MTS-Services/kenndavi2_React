<?php

namespace Database\Seeders;

use App\Enums\ProductType;
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
        $attachTypes = function (Category $category, array $types): void {
            $category->types()->delete();
            foreach ($types as $type) {
                $category->types()->create(['type' => $type]);
            }
        };

        $tree = [
            [
                'title' => 'Men',
                'types' => [ProductType::MEN->value],
                'children' => [
                    ['title' => 'T-Shirts', 'types' => [ProductType::MEN->value]],
                    ['title' => 'Jeans', 'types' => [ProductType::MEN->value]],
                    ['title' => 'Shoes', 'types' => [ProductType::MEN->value, ProductType::WOMEN->value]],
                ],
            ],
            [
                'title' => 'Women',
                'types' => [ProductType::WOMEN->value],
                'children' => [
                    ['title' => 'Dresses', 'types' => [ProductType::WOMEN->value]],
                    ['title' => 'Tops', 'types' => [ProductType::WOMEN->value]],
                    ['title' => 'Shoes', 'types' => [ProductType::MEN->value, ProductType::WOMEN->value]],
                ],
            ],
            [
                'title' => 'Accessories',
                'types' => [ProductType::ACCESSORIES->value],
                'children' => [
                    ['title' => 'Bags', 'types' => [ProductType::WOMEN->value, ProductType::ACCESSORIES->value]],
                    ['title' => 'Watches', 'types' => [ProductType::MEN->value, ProductType::WOMEN->value, ProductType::ACCESSORIES->value]],
                    ['title' => 'Hats', 'types' => [ProductType::ACCESSORIES->value]],
                ],
            ],
        ];

        foreach ($tree as $parentIndex => $parentRow) {
            $parentTitle = $parentRow['title'];
            $parent = Category::factory()->create([
                'title' => $parentTitle,
                'slug' => str($parentTitle)->slug(),
                'sort_order' => $parentIndex + 1,
                'image' => 'https://placehold.co/400x400?text=' . urlencode($parentTitle),
            ]);
            $attachTypes($parent, $parentRow['types']);

            foreach ($parentRow['children'] as $subIndex => $childRow) {
                $subTitle = $childRow['title'];
                $sub = Category::factory()->create([
                    'title' => $subTitle,
                    'slug' => str($parentTitle . ' ' . $subTitle)->slug(),
                    'sort_order' => $subIndex + 1,
                    'image' => 'https://placehold.co/400x400?text=' . urlencode($subTitle),
                ]);
                $attachTypes($sub, $childRow['types']);

                CategoryRelation::create([
                    'category_id' => $parent->id,
                    'sub_category_id' => $sub->id,
                    'sort_order' => $subIndex + 1,
                ]);
            }
        }
    }
}
