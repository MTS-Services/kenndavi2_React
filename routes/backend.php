<?php

use App\Http\Controllers\Backend\Admin\AdminDashboardController;
use App\Http\Controllers\Backend\User\UserDashboardController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UserSelectionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('/OrderManagement', [UserDashboardController::class, 'OrderManagement'])->name('OrderManagement');
    Route::get('/DashboarOrdersdetails', [UserDashboardController::class, 'DashboarOrdersdetails'])->name('DashboarOrdersdetails');
    Route::get('/DashboarProduct', [UserDashboardController::class, 'DashboarProduct'])->name('DashboarProduct');
    Route::get('/DashboarOrdersAdd', [UserDashboardController::class, 'DashboarOrdersAdd'])->name('DashboarOrdersAdd');
    Route::get('/DashboarCustomer', [UserDashboardController::class, 'DashboarCustomer'])->name('DashboarCustomer');
    Route::get('/UserDashboard', [UserDashboardController::class, 'UserDashboard'])->name('UserDashboard');

    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');
    });
    
    // Profile Routes
    Route::get('/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('user-profile.update');
});