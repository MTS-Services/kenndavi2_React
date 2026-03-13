<?php

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Tag;
use Illuminate\Support\Facades\Schema;

it('has expected core tables and columns', function () {
    expect(Schema::hasTable('products'))->toBeTrue();
    expect(Schema::hasColumns('products', [
        'id',
        'category_id',
        'title',
        'slug',
        'type',
        'status',
    ]))->toBeTrue();

    expect(Schema::hasTable('orders'))->toBeTrue();
    expect(Schema::hasColumns('orders', [
        'id',
        'order_number',
        'user_id',
        'grand_total',
        'status',
        'payment_status',
    ]))->toBeTrue();
});

it('creates product with relations and enums via factories', function () {
    $category = Category::factory()->create();
    $tag = Tag::factory()->create();

    $product = Product::factory()
        ->for($category)
        ->has(ProductVariant::factory()->count(2), 'variants')
        ->create([
            'status' => ProductStatus::ACTIVE->value,
        ]);

    $product->tags()->attach($tag);

    $product->refresh();

    expect($product->status)->toBeInstanceOf(ProductStatus::class);
    expect($product->category)->not->toBeNull();
    expect($product->variants)->toHaveCount(2);
    expect($product->tags)->toHaveCount(1);
});
