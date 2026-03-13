<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules {
        PasswordValidationRules::passwordRules insteadof ProfileValidationRules;
        PasswordValidationRules::passwordRules as fortifyPasswordRules;
        ProfileValidationRules::passwordRules as profilePasswordRules;
        ProfileValidationRules::profileRules as baseProfileRules;
        ProfileValidationRules::passwordConfirmationRules as profilePasswordConfirmationRules;
    }

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $profileRules = $this->baseProfileRules();
        unset($profileRules['password'], $profileRules['password_confirmation']);

        Validator::make($input, [
            ...$profileRules,
            'password' => $this->passwordRules(),
            'password_confirmation' => $this->profilePasswordConfirmationRules(),
        ])->validate();

        $fullName = trim($input['name'] ?? '');

        if ($fullName === '') {
            $firstName = '';
            $lastName = '';
        } else {
            $parts = preg_split('/\s+/', $fullName, 2);
            $firstName = $parts[0] ?? '';
            $lastName = $parts[1] ?? '';
        }

        return User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'status' => 'active',
        ]);
    }

    /**
     * Use Fortify's stronger password defaults for registration.
     *
     * @return array<int, Rule|array<mixed>|string>
     */
    protected function passwordRules(): array
    {
        return $this->fortifyPasswordRules();
    }
}
