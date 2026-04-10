<?php

use App\Models\Admin;
use App\Models\Banner;
use App\Models\BannerImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('admin can view banner content page with active type', function () {
    $banner = Banner::create([
        'type' => 'men',
        'content' => 'Hero copy',
        'action_title' => 'Shop Now',
        'action_url' => 'https://example.com/shop',
    ]);

    BannerImage::create([
        'banner_id' => $banner->id,
        'url' => '/storage/banners/sample.jpg',
        'alt_text' => 'sample',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->get(route('admin.banner-content.index', ['type' => 'men']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backend/Admin/banner-content')
        ->where('activeType', 'men')
        ->has('productTypes')
        ->where('banner.type', 'men')
        ->has('banner.images', 1)
    );
});

test('admin can update banner content and upload images', function () {
    Storage::fake('public');

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.banner-content.update'), [
            'type' => 'women',
            'content' => 'Women banner copy',
            'action_title' => 'Shop Women',
            'action_url' => 'https://example.com/women',
            'images' => [UploadedFile::fake()->image('hero.jpg')],
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.banner-content.index', ['type' => 'women']));

    $banner = Banner::where('type', 'women')->first();

    expect($banner)->not->toBeNull();
    expect($banner->content)->toBe('Women banner copy');
    expect($banner->action_title)->toBe('Shop Women');
    expect($banner->action_url)->toBe('https://example.com/women');

    $image = BannerImage::where('banner_id', $banner->id)->first();
    expect($image)->not->toBeNull();
    expect($image->url)->toStartWith('/storage/banners/');
});
