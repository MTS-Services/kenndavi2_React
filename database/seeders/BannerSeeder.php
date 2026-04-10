<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Admin;
use App\Models\Banner;
use App\Models\BannerImage;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminId = Admin::query()->value('id');

        $banners = [
            [
                'content' => 'Discover our latest collection of premium cotton t-shirts.',
                'type' => ProductType::MEN->value,
                'action_url' => '/products',
                'action_title' => 'Shop Now',
                'images' => [
                    ['url' => 'https://picsum.photos/seed/banner-new-arrivals/1920/600', 'alt_text' => 'New arrivals banner'],
                    ['url' => 'https://picsum.photos/seed/banner-cotton/1920/600', 'alt_text' => 'Premium cotton banner'],
                ],
            ],
            [
                'content' => 'Seasonal sale is here! Get up to 50% off on selected items.',
                'type' => ProductType::WOMEN->value,
                'action_url' => '/sale',
                'action_title' => 'View Sale',
                'images' => [
                    ['url' => 'https://picsum.photos/seed/banner-sale/1920/600', 'alt_text' => 'Seasonal sale banner'],
                    ['url' => 'https://picsum.photos/seed/banner-clearance/1920/600', 'alt_text' => 'Clearance banner'],
                ],
            ],
        ];

        foreach ($banners as $bannerData) {
            $images = $bannerData['images'] ?? [];
            unset($bannerData['images']);

            $banner = Banner::updateOrCreate(
                ['action_url' => $bannerData['action_url'], 'type' => $bannerData['type']],
                $bannerData
            );

            foreach ($images as $image) {
                BannerImage::updateOrCreate(
                    ['banner_id' => $banner->id, 'url' => $image['url']],
                    [
                        'banner_id' => $banner->id,
                        'url' => $image['url'],
                        'alt_text' => $image['alt_text'] ?? 'Promotion banner',
                    ]
                );
            }
        }
    }
}
