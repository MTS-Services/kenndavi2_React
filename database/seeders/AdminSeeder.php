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
        Admin::insert(
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@dev.com',
                'password' => Hash::make('superadmin@dev.com'),
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@dev.com',
                'password' => Hash::make('admin@dev.com'),
            ]
        );
    }
}

