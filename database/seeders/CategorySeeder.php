<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Admin;
use App\Models\Category;
use App\Models\CategoryRelation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attachTypes = function (Category $category, array $types): void {
            if (!Schema::hasTable('category_types')) {
                return;
            }

            $category->types()->delete();
            foreach ($types as $type) {
                $category->types()->create(['type' => $type]);
            }
        };

        $adminId = Admin::query()->value('id');

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
            $parent = Category::updateOrCreate(
                ['slug' => str($parentTitle)->slug()],
                [
                    'title' => $parentTitle,
                    'slug' => str($parentTitle)->slug(),
                    'sort_order' => $parentIndex + 1,
                    'image' => "https://picsum.photos/seed/category-" . str($parentTitle)->slug() . "/600/600",
                    'description' => "Shop {$parentTitle} collection: curated essentials, seasonal trends, and everyday staples.",
                    'status' => 'active',
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ]
            );
            $attachTypes($parent, $parentRow['types']);

            foreach ($parentRow['children'] as $subIndex => $childRow) {
                $subTitle = $childRow['title'];
                $childSlug = str($parentTitle . ' ' . $subTitle)->slug();
                $sub = Category::updateOrCreate(
                    ['slug' => $childSlug],
                    [
                        'title' => $subTitle,
                        'slug' => $childSlug,
                        'sort_order' => $subIndex + 1,
                        'image' => "https://picsum.photos/seed/category-" . $childSlug . "/600/600",
                        'description' => "Browse {$subTitle} in {$parentTitle}: quality fits, fresh colors, and reliable comfort.",
                        'status' => 'active',
                        'created_by' => $adminId,
                        'updated_by' => $adminId,
                    ]
                );
                $attachTypes($sub, $childRow['types']);

                CategoryRelation::updateOrCreate(
                    ['category_id' => $parent->id, 'sub_category_id' => $sub->id],
                    ['sort_order' => $subIndex + 1]
                );
            }
        }
    }
}
