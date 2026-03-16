<?php

namespace Database\Seeders;

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
        $banners = [
            [
                'content' => 'Discover our latest collection of premium cotton t-shirts.',
                'action_url' => '/products',
                'action_title' => 'Shop Now'
            ],
            [
                'content' => 'Seasonal sale is here! Get up to 50% off on selected items.',
                'action_url' => '/sale',
                'action_title' => 'View Sale'
            ],
        ];

        foreach ($banners as $bannerData) {
            $banner = Banner::create($bannerData);

            BannerImage::factory(2)->create([
                'banner_id' => $banner->id,
                'url' => "https://placehold.co/1920x600?text=Banner+Image",
                'alt_text' => 'Promotion Banner',
            ]);
        }
    }
}
