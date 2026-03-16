<?php

use App\Models\Admin;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('guests cannot access categories index', function () {
    $this->get(route('admin.categories.index'))->assertRedirect();
});

test('admin can view categories index with categories and categories for select', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.categories.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backend/Admin/category')
        ->has('categories')
        ->has('categoriesForSelect')
    );
});

test('admin can create a top-level category', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.categories.store'), [
            'title' => 'New Category',
            'slug' => 'new-category',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('categories', [
        'title' => 'New Category',
        'slug' => 'new-category',
    ]);
});

test('admin can create a subcategory with parent links', function () {
    $parent = Category::factory()->create();

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.categories.store'), [
            'title' => 'New Subcategory',
            'slug' => 'new-subcategory',
            'category_ids' => [$parent->id],
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');

    $category = Category::where('slug', 'new-subcategory')->first();
    expect($category)->not->toBeNull();
    expect($category->parents)->toHaveCount(1);
    expect($category->parents->first()->id)->toBe($parent->id);
});

test('admin can update a category', function () {
    $category = Category::factory()->create([
        'title' => 'Old Title',
        'slug' => 'old-slug',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.categories.update', $category->id), [
            'title' => 'Updated Title',
            'slug' => 'updated-slug',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');

    $category->refresh();
    expect($category->title)->toBe('Updated Title');
    expect($category->slug)->toBe('updated-slug');
});

test('admin can update a subcategory and sync parent links', function () {
    $parent1 = Category::factory()->create();
    $parent2 = Category::factory()->create();
    $sub = Category::factory()->create();
    $sub->parents()->attach($parent1->id, ['sort_order' => 0]);

    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.categories.update', $sub->id), [
            'title' => 'Updated Sub',
            'slug' => 'updated-sub',
            'category_ids' => [$parent2->id],
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.categories.index'));

    $sub->refresh();
    expect($sub->parents->pluck('id')->all())->toEqual([$parent2->id]);
});

test('admin can delete a category and its relations', function () {
    $parent = Category::factory()->create();
    $child = Category::factory()->create();
    $parent->children()->attach($child->id, ['sort_order' => 0]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.categories.destroy', $child->id));

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');

    $child->refresh();
    expect($child->trashed())->toBeTrue();
    expect(
        DB::table('category_relations')
            ->where('sub_category_id', $child->id)
            ->count()
    )->toBe(0);
});

test('admin can remove subcategory from one parent only and subcategory remains under other parents', function () {
    $parentA = Category::factory()->create();
    $parentB = Category::factory()->create();
    $sub = Category::factory()->create();
    $sub->parents()->attach([$parentA->id, $parentB->id], ['sort_order' => 0]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.categories.destroy', $sub->id).'?parent_id='.$parentB->id);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');

    expect(DB::table('category_relations')->where('category_id', $parentB->id)->where('sub_category_id', $sub->id)->count())->toBe(0);
    expect(DB::table('category_relations')->where('category_id', $parentA->id)->where('sub_category_id', $sub->id)->count())->toBe(1);
    expect(Category::find($sub->id))->not->toBeNull();
});

test('admin can remove subcategory from parent and subcategory is deleted when it has no other parents', function () {
    $parent = Category::factory()->create();
    $sub = Category::factory()->create();
    $sub->parents()->attach($parent->id, ['sort_order' => 0]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.categories.destroy', $sub->id).'?parent_id='.$parent->id);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');

    expect(DB::table('category_relations')->where('sub_category_id', $sub->id)->count())->toBe(0);
    $sub->refresh();
    expect($sub->trashed())->toBeTrue();
});

test('store validates required title and slug', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.categories.store'), []);

    $response->assertSessionHasErrors(['title', 'slug']);
});

test('store validates unique slug', function () {
    Category::factory()->create(['slug' => 'taken-slug']);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.categories.store'), [
            'title' => 'Some Title',
            'slug' => 'taken-slug',
        ]);

    $response->assertSessionHasErrors(['slug']);
});
