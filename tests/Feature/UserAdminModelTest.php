<?php

use App\Enums\AdminRole;
use App\Enums\AdminStatus;
use App\Enums\Gender;
use App\Enums\UserStatus;
use App\Models\Admin;
use App\Models\Cart;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\User;

it('creates user with all fillable attributes and casts', function () {
    $user = User::create([
        'created_by' => Admin::factory()->create()->id,
        'updated_by' => null,
        'deleted_by' => null,
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '123456789',
        'avatar' => 'avatars/john.png',
        'password' => 'secret-password',
        'gender' => Gender::MALE->value,
        'dob' => now()->subYears(30),
        'status' => UserStatus::ACTIVE->value,
        'email_verified_at' => now(),
        'remember_token' => 'token',
        'last_login_at' => now(),
        'otp' => '123456',
        'otp_expire_at' => now()->addMinutes(10),
        'state' => 'State',
        'city' => 'City',
        'zip_code' => '12345',
        'address_line' => '123 Street',
        'is_default' => true,
    ]);

    $user->refresh();

    expect($user->status)->toBeInstanceOf(UserStatus::class)
        ->and($user->gender)->toBeInstanceOf(Gender::class)
        ->and($user->is_default)->toBeTrue()
        ->and($user->name)->toBe('John Doe')
        ->and($user->full_name)->toBe('John Doe')
        ->and($user->avatar_url)->not->toBeNull();
});

it('creates admin with all fillable attributes and casts', function () {
    $admin = Admin::create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'phone' => '987654321',
        'password' => 'secret-password',
        'avatar' => 'avatars/admin.png',
        'gender' => Gender::FEMALE->value,
        'dob' => now()->subYears(28),
        'role' => AdminRole::ADMIN->value,
        'status' => AdminStatus::ACTIVE->value,
        'email_verified_at' => now(),
        'remember_token' => 'token',
    ]);

    $admin->refresh();

    expect($admin->gender)->toBeInstanceOf(Gender::class)
        ->and($admin->role)->toBeInstanceOf(AdminRole::class)
        ->and($admin->status)->toBeInstanceOf(AdminStatus::class);
});

it('links user with carts, orders and shipping addresses', function () {
    $user = User::factory()->create();

    $cart = Cart::factory()->for($user)->create();
    $order = Order::factory()->for($user)->create();
    $shippingAddress = ShippingAddress::factory()->create([
        'cart_id' => $cart->id,
        'user_id' => $user->id,
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '123456789',
        'state' => 'State',
        'city' => 'City',
        'zip_code' => '12345',
        'address' => '123 Street',
    ]);

    $user->refresh();

    expect($user->carts)->toHaveCount(1)
        ->and($user->orders)->toHaveCount(1)
        ->and($user->shippingAddresses)->toHaveCount(1)
        ->and($cart->user->is($user))->toBeTrue()
        ->and($order->user->is($user))->toBeTrue()
        ->and($shippingAddress->user->is($user))->toBeTrue();
}
);
