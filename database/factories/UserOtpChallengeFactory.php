<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserOtpChallenge;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<UserOtpChallenge>
 */
class UserOtpChallengeFactory extends Factory
{
    protected $model = UserOtpChallenge::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'challenge_token' => Str::uuid()->toString(),
            'code_hash' => Hash::make('123456'),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(2),
            'consumed_at' => null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }
}
