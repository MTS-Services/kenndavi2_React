<?php

use App\Enums\ProductStatus;
use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;

test('category listing applies search across product title and category names', function () {
    /** @var \Tests\TestCase $this */
    $parentCategory = Category::factory()->create([
        'title' => 'Outerwear',
        'slug' => 'outerwear',
    ]);
    $subCategory = Category::factory()->create([
        'title' => 'Zip Hoodies',
        'slug' => 'zip-hoodies',
    ]);
    $otherCategory = Category::factory()->create([
        'title' => 'Shoes',
        'slug' => 'shoes',
    ]);

    $productByTitle = Product::factory()->create([
        'title' => 'Phoenix Jacket',
        'type' => ProductType::MEN->value,
        'status' => ProductStatus::ACTIVE->value,
        'category_id' => $otherCategory->id,
    ]);
    $productByCategory = Product::factory()->create([
        'title' => 'Minimal Tee',
        'type' => ProductType::MEN->value,
        'status' => ProductStatus::ACTIVE->value,
        'category_id' => $parentCategory->id,
    ]);
    $productBySubcategory = Product::factory()->create([
        'title' => 'Classic Pullover',
        'type' => ProductType::MEN->value,
        'status' => ProductStatus::ACTIVE->value,
        'category_id' => $parentCategory->id,
        'subcategory_id' => $subCategory->id,
    ]);
    $nonMatchingProduct = Product::factory()->create([
        'title' => 'Plain Socks',
        'type' => ProductType::MEN->value,
        'status' => ProductStatus::ACTIVE->value,
        'category_id' => $otherCategory->id,
    ]);

    $this->get(route('products.category', ['type' => ProductType::MEN->value, 'search' => 'phoenix']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/products/category')
            ->where('search', 'phoenix')
            ->has('products.data', 1)
            ->where('products.data.0.id', $productByTitle->id));

    $this->get(route('products.category', ['type' => ProductType::MEN->value, 'search' => 'outerwear']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/products/category')
            ->where('search', 'outerwear')
            ->has('products.data', 2));

    $this->get(route('products.category', ['type' => ProductType::MEN->value, 'search' => 'zip']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/products/category')
            ->where('search', 'zip')
            ->has('products.data', 1)
            ->where('products.data.0.id', $productBySubcategory->id));

    $this->get(route('products.category', ['type' => ProductType::MEN->value, 'search' => 'socks']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/products/category')
            ->where('search', 'socks')
            ->has('products.data', 1)
            ->where('products.data.0.id', $nonMatchingProduct->id));

    $this->get(route('products.category', ['type' => ProductType::MEN->value, 'search' => 'unknown-term']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/products/category')
            ->where('search', 'unknown-term')
            ->has('products.data', 0));

    expect($productByCategory->id)->not->toBe($nonMatchingProduct->id);
});
