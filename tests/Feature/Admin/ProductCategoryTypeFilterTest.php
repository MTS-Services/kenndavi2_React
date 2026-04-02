<?php

use App\Models\Admin;
use App\Models\Category;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('product create only receives categories for the selected type', function () {
    $men = Category::factory()->create(['title' => 'Men Root']);
    $men->types()->create(['type' => 'men']);

    $women = Category::factory()->create(['title' => 'Women Root']);
    $women->types()->create(['type' => 'women']);

    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.products.create', ['type' => 'men']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backend/Admin/product/product-from')
        ->where('initialType', 'men')
        ->has('categories', 1)
        ->where('categories.0.id', $men->id)
    );
});

