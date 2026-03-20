<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make this seeder idempotent so it can be re-run safely.
        // Some environments may already contain `superadmin@dev.com`, which would
        // otherwise block inserting the second record and leave `admin@dev.com` missing.
        Admin::updateOrCreate(
            ['email' => 'superadmin@dev.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('superadmin@dev.com'),
            ]
        );

        Admin::updateOrCreate(
            ['email' => 'admin@dev.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin@dev.com'),
            ]
        );
    }
}

