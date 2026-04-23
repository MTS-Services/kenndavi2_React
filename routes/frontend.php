<?php

use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\FrontendController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\ProductController;
use App\Http\Controllers\Frontend\ProductSuggestionController;
use App\Http\Controllers\Frontend\UserOtpAuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Middleware\RecordProductView;
use App\Mail\TestMailtrapMail;
use App\Mail\UserOtpCodeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;

// Route::get('/', [FrontendController::class, 'index'])->name('home');
// Route::get('/men', [FrontendController::class, 'men'])->name('men');
// Route::get('/women', [FrontendController::class, 'women'])->name('women');
// Route::get('/accessories', [FrontendController::class, 'accessories'])->name('accessories');
// Route::get('/accessories/catalog', [FrontendController::class, 'accessoriesCatalog'])->name('accessories.catalog');
// Route::get('/productdetails', [FrontendController::class, 'productdetails'])->name('productdetails');
// Route::get('/ai-suggestion', [FrontendController::class, 'aisuggestion'])->name('aisuggestion');
// Route::get('/home-women', [FrontendController::class, 'homeWomen'])->name('home.women');
// Route::redirect('/cartpage', '/cart', 301)->name('cartpage');

Route::controller(CartController::class)->name('cart.')->group(function () {
    Route::get('/cart', 'index')->name('index');
    Route::middleware('throttle:cart-mutations')->group(function () {
        Route::post('/cart/items', [CartController::class, 'store'])->name('items.store');
        Route::patch('/cart/items/{cartItem}', [CartController::class, 'update'])->name('items.update');
        Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])->name('items.destroy');
    });
});

Route::post('/webhooks/stripe', [PaymentController::class, 'stripeWebhook'])->name('webhooks.stripe');
Route::post('/webhooks/paypal', [PaymentController::class, 'paypalWebhook'])->name('webhooks.paypal');
Route::post('/webhooks/authorize-net', [PaymentController::class, 'authorizeNetWebhook'])->name('webhooks.authorize-net');

// Route::middleware('throttle:cart-mutations')->group(function () {
//     Route::post('/cart/items', [CartController::class, 'store'])->name('cart.items.store');
//     Route::patch('/cart/items/{cartItem}', [CartController::class, 'update'])->name('cart.items.update');
//     Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])->name('cart.items.destroy');
// });

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

// Route::get('/productdetails2', [FrontendController::class, 'productdetails2'])->name('productdetails2');
// Route::get('/orderconfirmed', [FrontendController::class, 'orderconfirmed'])->name('orderconfirmed');
// Route::get('/hoodies-women', [FrontendController::class, 'hoodiesWomen'])->name('hoodies.women');
// Route::get('/sweatsuitsmen', [FrontendController::class, 'sweatsuitsMen'])->name('sweatsuitsmen');
// Route::get('/orders', [FrontendController::class, 'orders'])->name('orders');
// Route::get('/orders2', [FrontendController::class, 'orders2'])->name('orders2');
// Route::get('/shippings', [FrontendController::class, 'shippings'])->name('shippings');
// Route::get('/privacy-policy', [FrontendController::class, 'privacyPolicy'])->name('privacy.policy');
// Route::get('/terms-and-conditions', [FrontendController::class, 'termsAndConditions'])->name('terms.and.conditions');

if (app()->environment('local')) {
    Route::get('/test-mailtrap', function () {
        Mail::to('test@example.com')->send(new TestMailtrapMail);

        return 'Mailtrap test email dispatched.';
    })->name('test-mailtrap');

    Route::get('/dev/mail/preview/otp', function () {
        $mailable = new UserOtpCodeMail(
            code: '123456',
            challengeUrl: url('/user/otp/example-challenge'),
            verifyUrl: url('/user/otp/example-verify'),
            expiresAt: now()->addMinutes(2),
        );

        return response($mailable->render());
    })->name('dev.mail.preview.otp');

    Route::get('/dev/mail/preview/otp.txt', function () {
        $mailable = new UserOtpCodeMail(
            code: '123456',
            challengeUrl: url('/user/otp/example-challenge'),
            verifyUrl: url('/user/otp/example-verify'),
            expiresAt: now()->addMinutes(2),
        );

        $body = View::make('emails.auth.otp-code-text', [
            'code' => $mailable->code,
            'challengeUrl' => $mailable->challengeUrl,
            'verifyUrl' => $mailable->verifyUrl,
            'expiresAt' => $mailable->expiresAt,
            'expiryLabel' => $mailable->expiresAt?->diffForHumans() ?? 'shortly',
        ])->render();

        return response($body)->header('Content-Type', 'text/plain; charset=UTF-8');
    })->name('dev.mail.preview.otp.text');
}

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/details/{product}/suggestions', ProductSuggestionController::class)
    ->middleware('throttle:product-suggestions')
    ->name('products.suggestions');

Route::get('/ai-suggestion', [ProductSuggestionController::class, 'aiSuggestion'])->name('ai-suggestion');

Route::controller(ProductController::class)->name('products.')->group(function () {
    Route::get('/details/{id}', 'details')->middleware(RecordProductView::class)->name('details');
    Route::get('/{type}', 'category')->name('category');
});
