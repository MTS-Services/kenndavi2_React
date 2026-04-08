<?php

use App\Http\Controllers\Backend\User\OrderController;
use App\Http\Controllers\Backend\User\CheckoutController;
use App\Http\Controllers\Backend\User\AccountController;
use App\Http\Controllers\Backend\User\UserDashboardController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User routes (web guard)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    // Route::get('/profiles', [UserDashboardController::class, 'profiles'])->name('profiles');
    // Route::get('/review', [UserDashboardController::class, 'review'])->name('review');
    // Route::get('/Editprofile', [UserDashboardController::class, 'Editprofile'])->name('Editprofile');
    // Route::get('Editaddress', [UserDashboardController::class, 'Editaddress'])->name('Editaddress');
    // Route::get('settingx', [UserDashboardController::class, 'settingx'])->name('settingx');
    // // Profile Routes
    // Route::get('/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    // Route::post('/profile', [UserProfileController::class, 'update'])->name('user-profile.update');

    Route::controller(OrderController::class)->name('order.')->group(function () {
        Route::get('/shipping', 'shipping')->name('shipping');
        Route::post('/shipping', 'storeShipping')->name('shipping.store');
        Route::get('/orders', 'index')->name('index');
        Route::get('/review', 'review')->name('review');
        // Route::get('/order-management/payment', 'payment')->name('payment');
        // Route::get('/order-management/confirmation', 'confirmation')->name('confirmation');
    });

    Route::controller(CheckoutController::class)->middleware('throttle:checkout')->name('checkout.')->group(function () {
        Route::post('/checkout/place-order', 'placeOrder')->name('place-order');
        Route::get('/checkout/gateway/{order}', 'gateway')->name('gateway');
        Route::post('/checkout/start', 'start')->name('start');
    });

    // Route::get('/payment/{order}/success', [\App\Http\Controllers\PaymentController::class, 'paymentSuccess'])->name('payment.success');
    // Route::get('/payment/{order}/cancel', [\App\Http\Controllers\PaymentController::class, 'paymentFailed'])->name('payment.cancel');
    // Route::post('/payment/{order}/restore-cart', [PaymentController::class, 'restoreCart'])->name('payment.restore-cart');

    Route::controller(PaymentController::class)->prefix('payment')->name('payment.')->group(function () {
        Route::get('/{order}/success', 'paymentSuccess')->name('success');
        Route::get('/{order}/cancel', 'paymentFailed')->name('cancel');
        Route::post('/{order}/restore-cart', 'restoreCart')->name('restore-cart');
    });

    Route::controller(AccountController::class)->group(function () {
        Route::prefix('profile')->name('profile.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/edit', 'edit')->name('edit');
            Route::post('/update', 'update')->name('update');
        });

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', 'settings')->name('index');
            Route::post('/update', 'updateSettings')->name('update');
        });

        Route::prefix('address')->name('address.')->group(function () {
            Route::get('/', 'address')->name('edit');
            Route::post('/update', 'updateAddress')->name('update');
        });
    });
});
