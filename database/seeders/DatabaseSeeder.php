<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            ColorSeeder::class,
            SizeSeeder::class,
            TagSeeder::class,
            ProductSeeder::class,
            BannerSeeder::class,
            OrderSeeder::class,
            CartSeeder::class,
        ]);
    }
}
