<?php

use App\Models\Product;
use App\Models\ProductImage;

test('home featured products eager load primary image only', function () {
    $product = Product::factory()->create([
        'is_featured' => true,
    ]);

    $primary = ProductImage::factory()->for($product)->create([
        'is_primary' => true,
        'sort_order' => 0,
    ]);

    ProductImage::factory()->for($product)->count(2)->create([
        'is_primary' => false,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/home')
            ->has('products', 1)
            ->where('products.0.primary_image.id', $primary->id)
            ->missing('products.0.images'));
});
