<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'first_name' => 'Seeded',
                'last_name' => 'User One',
                'email' => 'user1@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Seeded',
                'last_name' => 'User Two',
                'email' => 'user2@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }

        if (User::count() < 10) {
            User::factory(50)->create();
        }
    }
}
