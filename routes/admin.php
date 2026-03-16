<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
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
        Route::get('products/check-slug', [ProductController::class, 'checkSlug'])
            ->name('products.checkSlug');
        Route::resource('products', ProductController::class)->names([
            'index'   => 'products.index',
            'create'  => 'products.create',
            'store'   => 'products.store',
            'edit'    => 'products.edit',
            'update'  => 'products.update',
            'destroy' => 'products.destroy',
        ]);

        // Customers
        Route::get('/customers', [AdminDashboardController::class, 'DashboarCustomer'])->name('customers.index');

        // Other admin utilities
        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');


        Route::controller(CategoryController::class)->group(function () {
            Route::get('/categories', 'index')->name('categories.index');
            Route::post('/categories', 'store')->name('categories.store');
            Route::get('/categories/{id}/edit', 'edit')->name('categories.edit');
            Route::put('/categories/{id}', 'update')->name('categories.update');
            Route::delete('/categories/{id}', 'destroy')->name('categories.destroy');
        });

        Route::controller(AnnouncementController::class)->name('announcement.')->prefix('announcement')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/publish/{id}', 'publish')->name('publish');
        });
    });
});
