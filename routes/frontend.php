<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/', [FrontendController::class, 'index'])->name('home');
    Route::get('/men', [FrontendController::class, 'men'])->name('men');
    Route::get('/women', [FrontendController::class, 'women'])->name('women');
    Route::get('/accessories', [FrontendController::class, 'accessories'])->name('accessories');
    Route::get('/productdetails', [FrontendController::class, 'productdetails'])->name('productdetails');
    Route::get('/ai-suggestion', [FrontendController::class, 'aisuggestion'])->name('aisuggestion');
    Route::get('/home-women', [FrontendController::class, 'homeWomen'])->name('home.women');
    Route::get('/cartpage', [FrontendController::class, 'cartpage'])->name('cartpage');

    // User OTP login at /login (Fortify GET /login shows userlogin view); /userlogin redirects to /login
    Route::redirect('/userlogin', '/login', 301)->name('userlogin');
    Route::post('/login/send-code', [AuthController::class, 'sendCode'])->name('login.send-code');
    Route::get('/login/verify', [AuthController::class, 'showVerify'])->name('login.verify');
    Route::post('/login/verify-code', [AuthController::class, 'verifyCode'])->name('login.verify-code');
    Route::get('/productdetails2', [FrontendController::class, 'productdetails2'])->name('productdetails2');
    Route::get('/orderconfirmed', [FrontendController::class, 'orderconfirmed'])->name('orderconfirmed');
    Route::get('/hoodies-women', [FrontendController::class, 'hoodiesWomen'])->name('hoodies.women');
    Route::get('/sweatsuitsmen', [FrontendController::class, 'sweatsuitsMen'])->name('sweatsuitsmen');
    Route::get('/orders', [FrontendController::class, 'orders'])->name('orders');
    Route::get('/orders2', [FrontendController::class, 'orders2'])->name('orders2');

});
