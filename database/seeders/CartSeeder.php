<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $variants = ProductVariant::all();

        if ($users->isEmpty()) {
            $this->call(UserSeeder::class);
            $users = User::all();
        }

        if ($variants->isEmpty()) {
            $this->call(ProductSeeder::class);
            $variants = ProductVariant::all();
        }

        $users->random(min(10, $users->count()))->each(function ($user) use ($variants) {
            $cart = Cart::updateOrCreate(['user_id' => $user->id]);

            $cartVariants = $variants->random(rand(1, 3));
            foreach ($cartVariants as $variant) {
                CartItem::updateOrCreate(
                    ['cart_id' => $cart->id, 'variant_id' => $variant->id],
                    [
                        'quantity' => rand(1, 2),
                        'unit_price' => $variant->price,
                    ]
                );
            }
        });
    }
}
