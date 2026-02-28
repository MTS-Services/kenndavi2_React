<?php

require __DIR__.'/settings.php';
require __DIR__.'/frontend.php';
require __DIR__.'/backend.php';

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// The initial login page (Email entry)
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

// The POST route that handles sending the code
Route::post('/login/send-code', [AuthController::class, 'sendCode'])->name('login.send-code');

// The page where user enters the code
Route::get('/login/verify', [AuthController::class, 'showVerify'])->name('login.verify');

// The POST route that verifies the code
Route::post('/login/verify', [AuthController::class, 'verifyCode'])->name('login.verify-code');