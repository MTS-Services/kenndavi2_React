<?php

namespace App\Providers;

use App\Listeners\MergeGuestCartOnLogin;
use App\Models\CartItem;
use App\Services\CartService;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        Schema::defaultStringLength(191);

        Event::listen(Login::class, MergeGuestCartOnLogin::class);

        RateLimiter::for('cart-mutations', function (Request $request) {
            $key = ($request->user()?->id ?? 'guest').':'.$request->session()->getId();

            return Limit::perMinute(60)->by($key);
        });

        Route::bind('cartItem', function (string $value) {
            $item = CartItem::query()->find($value);
            if ($item === null) {
                abort(404);
            }
            $cart = app(CartService::class)->resolveCart(request());
            if ((int) $item->cart_id !== (int) $cart->id) {
                abort(404);
            }

            return $item;
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null
        );
    }
}
