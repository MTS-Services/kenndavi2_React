<?php

use App\Models\Admin;
use Inertia\Testing\AssertableInertia as Assert;

test('admin login screen can be rendered', function () {
    $response = $this->get(route('admin.login'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('auth/admin-login')
    );
});

test('admins can authenticate using the password login screen', function () {
    $admin = Admin::factory()->create();

    $response = $this->post(route('admin.login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated('admin');
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('admins cannot authenticate with an invalid password', function () {
    $admin = Admin::factory()->create();

    $response = $this->post(route('admin.login.store'), [
        'email' => $admin->email,
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest('admin');
});
