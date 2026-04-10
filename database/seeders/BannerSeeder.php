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
                'content' => 'Aces In DA Hole was created to celebrate a brotherhood built over 30+ years, not by blood, but by loyalty. Through every setback, hardship, and triumph, we\'ve stood together, uplifted each other, and grown stronger as one. Our brand reflects that same standard, crafted to stand the test of time, just like real brotherhood does. Aces In DA Hole - "Built on Loyalty Designed to Last".',
                'type' => ProductType::MEN->value,
                'action_url' => '/products',
                'action_title' => 'Shop Now',
                'images' => [
                    ['url' => 'https://picsum.photos/seed/banner-new-arrivals/800/1000', 'alt_text' => 'New arrivals banner'],
                    ['url' => 'https://picsum.photos/seed/banner-cotton/800/1000', 'alt_text' => 'Premium cotton banner'],
                ],
            ],
            [
                'content' => 'Aces In DA Hole was created to celebrate a brotherhood built over 30+ years, not by blood, but by loyalty. Through every setback, hardship, and triumph, we\'ve stood together, uplifted each other, and grown stronger as one. Our brand reflects that same standard, crafted to stand the test of time, just like real brotherhood does. Aces In DA Hole - "Built on Loyalty Designed to Last".',
                'type' => ProductType::WOMEN->value,
                'action_url' => '/products',
                'action_title' => 'Shop Now',
                'images' => [
                    ['url' => 'https://picsum.photos/seed/banner-new-arrivals/800/1000', 'alt_text' => 'New arrivals banner'],
                    ['url' => 'https://picsum.photos/seed/banner-cotton/800/1000', 'alt_text' => 'Premium cotton banner'],
                ],
            ],
            [
                'content' => 'Aces In DA Hole was created to celebrate a brotherhood built over 30+ years, not by blood, but by loyalty. Through every setback, hardship, and triumph, we\'ve stood together, uplifted each other, and grown stronger as one. Our brand reflects that same standard, crafted to stand the test of time, just like real brotherhood does. Aces In DA Hole - "Built on Loyalty Designed to Last".',
                'type' => ProductType::ACCESSORIES->value,
                'action_url' => '/products',
                'action_title' => 'Shop Now',
                'images' => [
                    ['url' => 'https://picsum.photos/seed/banner-new-arrivals/800/1000', 'alt_text' => 'New arrivals banner'],
                    ['url' => 'https://picsum.photos/seed/banner-cotton/800/1000', 'alt_text' => 'Premium cotton banner'],
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
