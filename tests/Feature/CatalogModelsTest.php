<?php

use App\Enums\CategoryStatus;
use App\Enums\ProductStatus;
use App\Enums\ProductType;
use App\Enums\VariantStatus;
use App\Models\Category;
use App\Models\CategoryRelation;
use App\Models\Color;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductReview;
use App\Models\ProductTag;
use App\Models\ProductVariant;
use App\Models\Size;
use App\Models\Tag;

it('creates category tree and respects status cast', function () {
    $parent = Category::factory()->create([
        'status' => CategoryStatus::ACTIVE->value,
    ]);

    $child = Category::factory()->create();

    CategoryRelation::factory()->create([
        'category_id' => $parent->id,
        'sub_category_id' => $child->id,
        'sort_order' => 1,
    ]);

    $parent->refresh();
    $child->refresh();

    expect($parent->status)->toBeInstanceOf(CategoryStatus::class)
        ->and($parent->children)->toHaveCount(1)
        ->and($child->parents)->toHaveCount(1);
});

it('creates product with variants, images, tags and reviews', function () {
    $category = Category::factory()->create();
    $color = Color::factory()->create();
    $size = Size::factory()->create();
    $tag = Tag::factory()->create();

    $product = Product::factory()
        ->for($category)
        ->create([
            'type' => ProductType::MEN->value,
            'status' => ProductStatus::ACTIVE->value,
            'is_featured' => true,
        ]);

    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'color_id' => $color->id,
        'size_id' => $size->id,
        'status' => VariantStatus::ACTIVE->value,
    ]);

    $image = ProductImage::factory()->create([
        'product_id' => $product->id,
        'color_id' => $color->id,
        'url' => 'https://example.com/product.jpg',
        'alt_text' => 'Product image',
        'is_primary' => true,
    ]);

    $product->tags()->attach($tag);

    $order = Order::factory()->create();

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'variant_id' => $variant->id,
        'product_title' => $product->title,
    ]);

    $review = ProductReview::factory()->create([
        'product_id' => $product->id,
        'order_item_id' => $orderItem->id,
    ]);

    $product->refresh();
    $variant->refresh();
    $image->refresh();
    $tag->refresh();
    $review->refresh();

    expect($product->status)->toBeInstanceOf(ProductStatus::class)
        ->and($product->type)->toBeInstanceOf(ProductType::class)
        ->and($product->variants)->toHaveCount(1)
        ->and($product->images)->toHaveCount(1)
        ->and($product->tags)->toHaveCount(1)
        ->and($product->reviews)->toHaveCount(1)
        ->and($variant->status)->toBeInstanceOf(VariantStatus::class)
        ->and($image->is_primary)->toBeTrue()
        ->and($review->product->is($product))->toBeTrue()
        ->and($review->orderItem->is($orderItem))->toBeTrue();
});

it('uses product tag pivot model correctly', function () {
    $product = Product::factory()->create();
    $tag = Tag::factory()->create();

    ProductTag::factory()->create([
        'product_id' => $product->id,
        'tag_id' => $tag->id,
    ]);

    $product->refresh();
    $tag->refresh();

    expect($product->tags)->toHaveCount(1)
        ->and($tag->products)->toHaveCount(1);
});

it('links colors and sizes with variants and images', function () {
    $color = Color::factory()->create();
    $size = Size::factory()->create();
    $product = Product::factory()->create();

    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'color_id' => $color->id,
        'size_id' => $size->id,
    ]);

    $image = ProductImage::factory()->create([
        'product_id' => $product->id,
        'color_id' => $color->id,
        'url' => 'https://example.com/product.jpg',
        'alt_text' => 'Product image',
    ]);

    $color->refresh();
    $size->refresh();

    expect($color->variants)->toHaveCount(1)
        ->and($color->images)->toHaveCount(1)
        ->and($size->variants)->toHaveCount(1)
        ->and($variant->color->is($color))->toBeTrue()
        ->and($variant->size->is($size))->toBeTrue()
        ->and($image->color->is($color))->toBeTrue();
});
