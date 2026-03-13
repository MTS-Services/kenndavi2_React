<?php

use App\Models\Admin;
use App\Models\Banner;
use App\Models\BannerImage;

it('creates banner with images and admin relations', function () {
    $admin = Admin::factory()->create();

    $banner = Banner::factory()->create([
        'created_by' => $admin->id,
        'updated_by' => $admin->id,
    ]);

    $image = BannerImage::factory()->create([
        'banner_id' => $banner->id,
        'url' => 'https://example.com/banner.jpg',
        'alt_text' => 'Banner',
    ]);

    $banner->refresh();

    expect($banner->images)->toHaveCount(1)
        ->and($image->banner->is($banner))->toBeTrue()
        ->and($banner->createdBy?->is($admin))->toBeTrue()
        ->and($banner->updatedBy?->is($admin))->toBeTrue();
}
);
