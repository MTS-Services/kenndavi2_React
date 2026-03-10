<?php

use App\Http\Controllers\Backend\Admin\AdminAuthController;
use App\Http\Controllers\Backend\Admin\AdminDashboardController;
use App\Http\Controllers\UserSelectionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin routes (admin guard)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'create'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'store'])->name('login.store');

        // Admin Password Reset
        Route::get('/forgot-password', [AdminAuthController::class, 'showForgot'])->name('password.request');
        Route::post('/forgot-password/send-code', [AdminAuthController::class, 'sendCode'])->name('password.send-code');
        Route::get('/forgot-password/verify', [AdminAuthController::class, 'showVerify'])->name('password.verify');
        Route::post('/forgot-password/verify-code', [AdminAuthController::class, 'verifyCode'])->name('password.verify-code');
        Route::get('/forgot-password/reset', [AdminAuthController::class, 'showReset'])->name('password.reset');
        Route::post('/forgot-password/reset', [AdminAuthController::class, 'reset'])->name('password.update');
        Route::get('/forgot-password/resend', [AdminAuthController::class, 'resendCode'])->name('password.resend');
    });

    Route::middleware(['admin'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'destroy'])->name('logout');

        // Dashboard
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

        // Orders
        Route::get('/orders', [AdminDashboardController::class, 'OrderManagement'])->name('orders.index');
        Route::get('/orders/details', [AdminDashboardController::class, 'DashboarOrdersdetails'])->name('orders.details');
        Route::get('/orders/shipped', [AdminDashboardController::class, 'DashboarShipped'])->name('orders.shipped');
        Route::get('/orders/delivered', [AdminDashboardController::class, 'DashboarDelivered'])->name('orders.delivered');
        Route::get('/orders/cancelled', [AdminDashboardController::class, 'DashboarCancelled'])->name('orders.cancelled');

        // Products
        Route::get('/products', [AdminDashboardController::class, 'DashboarProduct'])->name('products.index');
        Route::get('/products/add', [AdminDashboardController::class, 'DashboarOrdersAdd'])->name('products.create');

        // Customers
        Route::get('/customers', [AdminDashboardController::class, 'DashboarCustomer'])->name('customers.index');

        // Other admin utilities
        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');
    });
});
