<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserOtpChallenge;
use Illuminate\Database\Eloquent\Factories\Factory;
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
        $code = (string) random_int(100000, 999999);

        return [
            'user_id'         => User::factory(),
            'challenge_token' => Str::uuid()->toString(),
            // HMAC-SHA256 matches the controller — bcrypt is no longer used.
            'code_hash'       => hash_hmac('sha256', $code, config('app.key')),
            'attempts'        => 0,
            'expires_at'      => now()->addMinutes(2),
            'consumed_at'     => null,
            'ip_address'      => fake()->ipv4(),
            'user_agent'      => fake()->userAgent(),
        ];
    }

    /**
     * Set a known plaintext code so tests can assert against it.
     *
     * Usage: UserOtpChallenge::factory()->withCode('123456')->create()
     */
    public function withCode(string $code): static
    {
        return $this->state([
            'code_hash' => hash_hmac('sha256', $code, config('app.key')),
        ]);
    }

    public function expired(): static
    {
        return $this->state(['expires_at' => now()->subMinute()]);
    }

    public function consumed(): static
    {
        return $this->state(['consumed_at' => now()]);
    }

    public function exhausted(): static
    {
        return $this->state(['attempts' => 5]);
    }
}
