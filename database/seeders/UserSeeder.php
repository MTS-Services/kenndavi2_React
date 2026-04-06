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
                'first_name' => 'Ava',
                'last_name' => 'Johnson',
                'email' => 'ava.johnson@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Liam',
                'last_name' => 'Williams',
                'email' => 'liam.williams@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Noah',
                'last_name' => 'Brown',
                'email' => 'noah.brown@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Emma',
                'last_name' => 'Davis',
                'email' => 'emma.davis@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Olivia',
                'last_name' => 'Miller',
                'email' => 'olivia.miller@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Elijah',
                'last_name' => 'Wilson',
                'email' => 'elijah.wilson@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Sophia',
                'last_name' => 'Moore',
                'email' => 'sophia.moore@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Mason',
                'last_name' => 'Taylor',
                'email' => 'mason.taylor@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Isabella',
                'last_name' => 'Anderson',
                'email' => 'isabella.anderson@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'James',
                'last_name' => 'Thomas',
                'email' => 'james.thomas@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Mia',
                'last_name' => 'Jackson',
                'email' => 'mia.jackson@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
            [
                'first_name' => 'Benjamin',
                'last_name' => 'White',
                'email' => 'benjamin.white@example.com',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }
    }
}
