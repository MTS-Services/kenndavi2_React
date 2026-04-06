<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Admin;
use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductTag;
use App\Models\ProductVariant;
use App\Models\Size;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminId = Admin::query()->value('id');
        if (!$adminId) {
            $this->call(AdminSeeder::class);
            $adminId = Admin::query()->value('id');
        }

        $categoriesQuery = Category::query();
        if (Schema::hasTable('category_types')) {
            $categoriesQuery->with(['types']);
        }
        $categories = $categoriesQuery->get();
        $colors = Color::all();
        $sizes = Size::all();
        $tags = Tag::all();

        if ($categories->isEmpty()) {
            $this->call(CategorySeeder::class);
            $categories = Category::query()
                ->whereDoesntHave('parents')
                ->with(['types'])
                ->get();
        }

        if ($colors->isEmpty()) {
            $this->call(ColorSeeder::class);
            $colors = Color::all();
        }

        if ($sizes->isEmpty()) {
            $this->call(SizeSeeder::class);
            $sizes = Size::all();
        }

        if ($tags->isEmpty()) {
            $this->call(TagSeeder::class);
            $tags = Tag::all();
        }

        $typeValuesByCategory = function (Category $category): array {
            if (!Schema::hasTable('category_types')) {
                return array_map(fn (ProductType $t) => $t->value, ProductType::cases());
            }

            $values = $category->types
                ->pluck('type')
                ->map(fn (ProductType|string $t) => $t instanceof ProductType ? $t->value : (string) $t)
                ->filter()
                ->unique()
                ->values()
                ->all();

            if (!empty($values)) {
                return $values;
            }

            return array_map(fn (ProductType $t) => $t->value, ProductType::cases());
        };

        $catalog = [
            ProductType::MEN->value => [
                ['title' => 'Essential Crewneck T-Shirt', 'price' => 24.99],
                ['title' => 'Slim Fit Stretch Jeans', 'price' => 64.00],
                ['title' => 'Everyday Oxford Shirt', 'price' => 48.50],
                ['title' => 'Lightweight Zip Hoodie', 'price' => 59.00],
                ['title' => 'Classic Chino Pants', 'price' => 55.00],
                ['title' => 'Running Sneakers', 'price' => 89.00],
                ['title' => 'Puffer Jacket', 'price' => 119.00],
                ['title' => 'Wool Blend Sweater', 'price' => 72.00],
                ['title' => 'Leather Belt', 'price' => 29.00],
                ['title' => 'Breathable Polo Shirt', 'price' => 34.00],
                ['title' => 'Tech Fabric Shorts', 'price' => 39.00],
                ['title' => 'Minimalist Canvas Trainers', 'price' => 74.00],
            ],
            ProductType::WOMEN->value => [
                ['title' => 'Wrap Midi Dress', 'price' => 79.00],
                ['title' => 'Ribbed Knit Top', 'price' => 32.00],
                ['title' => 'High-Waist Straight Jeans', 'price' => 68.00],
                ['title' => 'Relaxed Fit Blazer', 'price' => 98.00],
                ['title' => 'Pleated Skirt', 'price' => 54.00],
                ['title' => 'Comfort Sandals', 'price' => 59.00],
                ['title' => 'Everyday Tote Bag', 'price' => 45.00],
                ['title' => 'Soft Cardigan', 'price' => 66.00],
                ['title' => 'Classic Pumps', 'price' => 89.00],
                ['title' => 'Oversized Cotton Shirt', 'price' => 44.00],
                ['title' => 'Active Leggings', 'price' => 42.00],
                ['title' => 'Lightweight Trench Coat', 'price' => 129.00],
            ],
            ProductType::ACCESSORIES->value => [
                ['title' => 'Stainless Steel Watch', 'price' => 149.00],
                ['title' => 'Leather Crossbody Bag', 'price' => 95.00],
                ['title' => 'Polarized Sunglasses', 'price' => 59.00],
                ['title' => 'Baseball Cap', 'price' => 18.00],
                ['title' => 'Wool Beanie', 'price' => 22.00],
                ['title' => 'Travel Backpack', 'price' => 89.00],
                ['title' => 'Minimalist Wallet', 'price' => 35.00],
                ['title' => 'Silk Scarf', 'price' => 39.00],
                ['title' => 'Classic Bracelet', 'price' => 28.00],
                ['title' => 'Everyday Socks (3-Pack)', 'price' => 14.00],
                ['title' => 'Sporty Duffle Bag', 'price' => 69.00],
                ['title' => 'Metallic Hoop Earrings', 'price' => 24.00],
            ],
        ];

        $seedProduct = function (Category $category, string $type, int $index) use ($adminId, $catalog, $colors, $sizes, $tags): void {
            $pick = ($catalog[$type] ?? $catalog[ProductType::MEN->value])[$index % 12];
            $title = $pick['title'] . ' - ' . $category->title . ' ' . str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);
            $slug = Str::slug($title) . '-' . Str::lower(Str::random(6));

            $product = Product::create([
                'category_id' => $category->id,
                'subcategory_id' => null,
                'title' => $title,
                'slug' => $slug,
                'description' => "A reliable {$pick['title']} designed for comfort, fit, and everyday wear.",
                'price' => $pick['price'],
                'discount' => null,
                'discount_type' => null,
                'discount_starts_at' => null,
                'discount_ends_at' => null,
                'type' => $type,
                'is_featured' => ($index % 10) === 0,
                'is_new' => $index < 3,
                'status' => 'active',
                'sort_order' => $index + 1,
                'meta_title' => $title,
                'meta_description' => "Shop {$title}. Quality materials, great fit, fast shipping.",
                'meta_keywords' => [$category->title, $type, 'fashion', 'store'],
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $imageSeeds = [
                'front',
                'detail',
                'lifestyle',
            ];
            foreach ($imageSeeds as $imgIndex => $imgSeed) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'color_id' => null,
                    'url' => "https://picsum.photos/seed/product-" . $product->slug . "-" . $imgSeed . "/800/1000",
                    'alt_text' => $product->title,
                    'is_primary' => $imgIndex === 0,
                    'sort_order' => $imgIndex + 1,
                ]);
            }

            $pickedTags = $tags->count() > 0 ? $tags->shuffle()->take(min(3, $tags->count())) : collect();
            foreach ($pickedTags as $tag) {
                ProductTag::updateOrCreate(
                    ['product_id' => $product->id, 'tag_id' => $tag->id],
                    ['product_id' => $product->id, 'tag_id' => $tag->id]
                );
            }

            $productColors = $colors->count() > 0 ? $colors->shuffle()->take(min(2, $colors->count())) : collect([null]);
            $productSizes = $sizes->count() > 0 ? $sizes->shuffle()->take(min(3, $sizes->count())) : collect([null]);

            foreach ($productColors as $color) {
                foreach ($productSizes as $size) {
                    ProductVariant::updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'color_id' => $color?->id,
                            'size_id' => $size?->id,
                        ],
                        [
                            'quantity' => 25 + ($index % 20),
                            'status' => 'active',
                            'created_by' => $adminId,
                            'updated_by' => $adminId,
                        ]
                    );
                }
            }
        };

        foreach ($categories as $category) {
            $types = $typeValuesByCategory($category);
            $existing = Product::query()->where('category_id', $category->id)->count();
            $missing = max(0, 10 - $existing);

            for ($i = 0; $i < $missing; $i++) {
                $type = $types[$i % max(1, count($types))] ?? ProductType::MEN->value;
                $seedProduct($category, $type, $existing + $i);
            }
        }

        // Global guarantee: each type must exist at least 10 times
        foreach (ProductType::cases() as $typeCase) {
            $type = $typeCase->value;
            $existing = Product::query()->where('type', $type)->count();
            $missing = max(0, 10 - $existing);
            if ($missing === 0) {
                continue;
            }

            $category = $categories->first(fn (Category $c) => in_array($type, $typeValuesByCategory($c), true))
                ?? $categories->first();

            if (!$category) {
                continue;
            }

            for ($i = 0; $i < $missing; $i++) {
                $seedProduct($category, $type, $existing + $i);
            }
        }
    }
}
