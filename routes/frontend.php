<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/', [FrontendController::class, 'index'])->name('home');
    Route::get('/men', [FrontendController::class, 'men'])->name('men');
    Route::get('/women', [FrontendController::class, 'women'])->name('women');
    Route::get('/accessories', [FrontendController::class, 'accessories'])->name('accessories');
    Route::get('/productdetails', [FrontendController::class, 'productdetails'])->name('productdetails');
});
