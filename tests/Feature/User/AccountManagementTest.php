<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use function Pest\Laravel\actingAs;

test('profile page renders with profile and address props', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('user.profile.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/user/profile')
            ->has('profile')
            ->has('address')
        );
});

test('user can update profile information', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('user.profile.update'), [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '1234567890',
        ])
        ->assertRedirect(route('user.profile.index'))
        ->assertSessionHas('toast');

    $user->refresh();
    expect($user->first_name)->toBe('John')
        ->and($user->last_name)->toBe('Doe')
        ->and($user->email)->toBe('john.doe@example.com')
        ->and($user->phone)->toBe('1234567890');
});

test('user can update address fields', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('user.address.update'), [
            'state' => 'California',
            'city' => 'San Diego',
            'zip_code' => '92101',
            'address_line' => '123 Harbor Drive',
        ])
        ->assertRedirect(route('user.profile.index'))
        ->assertSessionHas('toast');

    $user->refresh();
    expect($user->state)->toBe('California')
        ->and($user->city)->toBe('San Diego')
        ->and($user->zip_code)->toBe('92101')
        ->and($user->address_line)->toBe('123 Harbor Drive');
});

test('logout current action signs out authenticated user', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('user.settings.update'), ['action' => 'logout_current'])
        ->assertRedirect('/');

    expect(Auth::check())->toBeFalse();
});

test('logout everywhere action signs out authenticated user', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('user.settings.update'), ['action' => 'logout_everywhere'])
        ->assertRedirect('/');

    expect(Auth::check())->toBeFalse();
});
