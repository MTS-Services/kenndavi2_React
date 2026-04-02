<?php

use App\Http\Controllers\Frontend\FrontendController;
use App\Http\Controllers\Frontend\UserOtpAuthController;
use App\Mail\TestMailtrapMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontendController::class, 'index'])->name('home');
Route::get('/men', [FrontendController::class, 'men'])->name('men');
Route::get('/women', [FrontendController::class, 'women'])->name('women');
Route::get('/accessories', [FrontendController::class, 'accessories'])->name('accessories');
Route::get('/accessories/catalog', [FrontendController::class, 'accessoriesCatalog'])->name('accessories.catalog');
Route::get('/productdetails', [FrontendController::class, 'productdetails'])->name('productdetails');
Route::get('/ai-suggestion', [FrontendController::class, 'aisuggestion'])->name('aisuggestion');
Route::get('/home-women', [FrontendController::class, 'homeWomen'])->name('home.women');
Route::get('/cartpage', [FrontendController::class, 'cartpage'])->name('cartpage');
Route::post('/cartpage', [FrontendController::class, 'addToCart'])->name('cartpage.add');

// Temporary login overrides kept here for reference while Fortify owns /login.
// Route::redirect('/userlogin', '/login', 301)->name('userlogin');
// Route::post('/login/send-code', [AuthController::class, 'sendCode'])->name('login.send-code');
// Route::get('/login/verify', [AuthController::class, 'showVerify'])->name('login.verify');
// Route::post('/login/verify-code', [AuthController::class, 'verifyCode'])->name('login.verify-code');

Route::prefix('user/otp')->name('user.otp.')->controller(UserOtpAuthController::class)->group(function () {
    Route::post('/request', 'store')
        ->middleware('throttle:user-otp')
        ->name('request');
    Route::get('/challenge/{challenge}', 'challenge')->middleware('signed')->name('challenge');
    Route::post('/challenge/{challenge}', 'verify')
        ->middleware(['signed', 'throttle:user-otp'])
        ->name('verify');
    Route::post('/challenge/{challenge}/resend', 'resend')
        ->middleware(['signed', 'throttle:user-otp'])
        ->name('resend');
});
Route::get('/productdetails2', [FrontendController::class, 'productdetails2'])->name('productdetails2');
Route::get('/orderconfirmed', [FrontendController::class, 'orderconfirmed'])->name('orderconfirmed');
Route::get('/hoodies-women', [FrontendController::class, 'hoodiesWomen'])->name('hoodies.women');
Route::get('/sweatsuitsmen', [FrontendController::class, 'sweatsuitsMen'])->name('sweatsuitsmen');
Route::get('/orders', [FrontendController::class, 'orders'])->name('orders');
Route::get('/orders2', [FrontendController::class, 'orders2'])->name('orders2');
Route::get('/shippings', [FrontendController::class, 'shippings'])->name('shippings');
Route::get('/privacy-policy', [FrontendController::class, 'privacyPolicy'])->name('privacy.policy');
Route::get('/terms-and-conditions', [FrontendController::class, 'termsAndConditions'])->name('terms.and.conditions');

Route::get('/test-mailtrap', function () {
    Mail::to('test@example.com')->send(new TestMailtrapMail);

    return 'Mailtrap test email dispatched.';
})->name('test-mailtrap');
