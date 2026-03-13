<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductTag;
use App\Models\ProductVariant;
use App\Models\Size;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        $colors = Color::all();
        $sizes = Size::all();
        $tags = Tag::all();

        if ($categories->isEmpty()) {
            $this->call(CategorySeeder::class);
            $categories = Category::all();
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

        $categories->each(function ($category) use ($colors, $sizes, $tags) {
            Product::factory(5)->create([
                'category_id' => $category->id,
            ])->each(function ($product) use ($colors, $sizes, $tags) {
                // Add Images
                ProductImage::factory(3)->create([
                    'product_id' => $product->id,
                    'url' => "https://placehold.co/800x1000?text=" . urlencode($product->title),
                    'alt_text' => $product->title,
                    'is_primary' => false,
                ]);

                // Set one image as primary
                $product->images()->first()->update(['is_primary' => true]);

                // Add Tags
                $productTags = $tags->random(rand(1, 3));
                foreach ($productTags as $tag) {
                    ProductTag::create([
                        'product_id' => $product->id,
                        'tag_id' => $tag->id,
                    ]);
                }

                // Add Variants
                $productColors = $colors->random(rand(1, 3));
                $productSizes = $sizes->random(rand(2, 4));

                foreach ($productColors as $color) {
                    foreach ($productSizes as $size) {
                        ProductVariant::factory()->create([
                            'product_id' => $product->id,
                            'color_id' => $color->id,
                            'size_id' => $size->id,
                        ]);
                    }
                }
            });
        });
    }
}
