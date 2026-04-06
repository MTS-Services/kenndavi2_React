<?php

namespace App\Listeners;

use App\Models\Cart;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Auth\Events\Login;

class MergeGuestCartOnLogin
{
    public function __construct(
        protected CartService $cartService,
    ) {}

    public function handle(Login $event): void
    {
        if ($event->guard !== 'web') {
            return;
        }

        $user = $event->user;
        if (! $user instanceof User) {
            return;
        }

        $guestCartId = session()->get(CartService::SESSION_CART_ID_KEY);
        if ($guestCartId === null) {
            return;
        }

        $guestCart = Cart::query()
            ->whereNull('user_id')
            ->whereKey($guestCartId)
            ->first();

        session()->forget(CartService::SESSION_CART_ID_KEY);

        if ($guestCart === null) {
            return;
        }

        $userCart = Cart::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['expires_at' => null],
        );

        $this->cartService->mergeGuestCartIntoUserCart($guestCart, $userCart);
    }
}
