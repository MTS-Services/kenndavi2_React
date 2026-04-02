<?php

use App\Enums\ProductStatus;
use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use Database\Seeders\CategorySeeder;

test('home inertia response includes frontendNav with all product types', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('frontendNav')
        ->has('frontendNav.productTypes')
        ->has('frontendNav.byType')
        ->has('frontendNav.byType.men')
        ->has('frontendNav.byType.women')
        ->has('frontendNav.byType.accessories')
        ->has('frontendNav.byType.men.landingHref')
        ->has('frontendNav.byType.men.listingHref')
        ->has('frontendNav.byType.men.categories')
        ->has('frontendNav.byType.accessories.listingHref')
    );
});

test('accessories catalog route renders inertia page', function () {
    $this->get(route('accessories.catalog'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('frontend/accessories-catalog'));
});

test('frontendNav categories expose numeric ids when categories are seeded', function () {
    $this->seed(CategorySeeder::class);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('frontendNav.byType.men.categories.0.id')
            ->where('frontendNav.byType.men.categories.0.id', fn ($id) => is_int($id)));
});

test('catalog listing accepts numeric category and subcategory ids', function () {
    $this->seed(CategorySeeder::class);

    $menParent = Category::query()
        ->whereDoesntHave('parents')
        ->forType(ProductType::MEN)
        ->where('title', 'Men')
        ->first();
    expect($menParent)->not->toBeNull();
    $sub = $menParent->children()->first();
    expect($sub)->not->toBeNull();

    Product::factory()->create([
        'category_id' => $sub->id,
        'type' => ProductType::MEN,
        'status' => ProductStatus::ACTIVE->value,
    ]);

    $response = $this->get(route('sweatsuitsmen', [
        'category' => 'not-a-number',
        'subcategory' => '0',
    ]));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('selectedCategory', 'all')
        ->where('selectedSubcategory', 'all'));

    $this->get(route('sweatsuitsmen', ['category' => (string) $menParent->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('selectedCategory', (string) $menParent->id));
});
