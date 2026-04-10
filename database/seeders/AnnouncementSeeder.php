<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Announcement::create([
            'is_active' => true,
            'announcement' => ' Free Standard Delivery & 30-Day Free Returns | Free
                        Standard Delivery & 30-Day Free Returns | Free Standard
                        Delivery & 30-Day Free Returns | Free Standard Delivery
                        & 30-Day Free Returns | Free Standard Delivery & 30-Day
                        Free Returns | Free Standard Delivery & 30-Day Free
                        Returns |',
        ]);
    }
}
