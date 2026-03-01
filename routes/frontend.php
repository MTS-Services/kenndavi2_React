<?php

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
    Route::get('/userlogin', [FrontendController::class, 'userlogin'])->name('userlogin');
    Route::get('/entercode', [FrontendController::class, 'entercode'])->name('entercode');
    Route::get('/productdetails2', [FrontendController::class, 'productdetails2'])->name('productdetails2');
    Route::get('/orderconfirmed', [FrontendController::class, 'orderconfirmed'])->name('orderconfirmed');
    
});
