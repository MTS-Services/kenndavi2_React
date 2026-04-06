<?php

use App\Http\Controllers\Backend\User\OrderController;
use App\Http\Controllers\Backend\User\UserDashboardController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User routes (web guard)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profiles', [UserDashboardController::class, 'profiles'])->name('profiles');
    Route::get('/review', [UserDashboardController::class, 'review'])->name('review');
    Route::get('/Editprofile', [UserDashboardController::class, 'Editprofile'])->name('Editprofile');
    Route::get('Editaddress', [UserDashboardController::class, 'Editaddress'])->name('Editaddress');
    Route::get('settingx', [UserDashboardController::class, 'settingx'])->name('settingx');
    // Profile Routes
    Route::get('/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('user-profile.update');

    Route::controller(OrderController::class)->name('order.')->group(function () {
        Route::get('/shipping', 'shipping')->name('shipping');
        Route::post('/shipping', 'storeShipping')->name('shipping.store');
        Route::get('/order-management', 'index')->name('index');
        Route::get('/order-management/payment', 'payment')->name('payment');
        Route::get('/order-management/confirmation', 'confirmation')->name('confirmation');
    });
});
