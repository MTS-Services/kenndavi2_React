<?php

namespace Database\Seeders;

use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class PaymentGatewaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gateways = [
            [
                'sort_order' => 1,
                'name' => 'Stripe',
                'slug' => 'stripe',
                'icon' => null,
                'live_data' => [
                    'api_key' => 'pk_test_51RyARmHCDWKjgteWVY1qf6s0JcQazy1eWTa9UZvfDQfx1z3SetUJNF8v6sLHFRTm1ZPvOjWZgdl4P2Tu9s3TNw1e00HENy5EhS',
                    'secret_key' => 'sk_test_51RyARmHCDWKjgteWucouB1313fWtSqsTmtA8cyjyiJ81YS4JUOGEYKZhaGbzBGMka1eb52CMo1bU9r74O9ICCVWJ00qbt8yfNC',
                    'webhook_secret' => null
                ],
                'sandbox_data' => [
                    'public_key' => 'pk_test_51RyARmHCDWKjgteWVY1qf6s0JcQazy1eWTa9UZvfDQfx1z3SetUJNF8v6sLHFRTm1ZPvOjWZgdl4P2Tu9s3TNw1e00HENy5EhS',
                    'secret_key' => 'sk_test_51RyARmHCDWKjgteWucouB1313fWtSqsTmtA8cyjyiJ81YS4JUOGEYKZhaGbzBGMka1eb52CMo1bU9r74O9ICCVWJ00qbt8yfNC',
                    'webhook_secret' => null
                ],
                'is_active' => true,
                'mode' => 'sandbox',
            ],
            [
                'sort_order' => 2,
                'name' => 'NowPayments',
                'slug' => 'crypto',
                'icon' => null,
                'live_data' => [
                    'api_key' => 'RYSKHPP-2VEM33J-NHCEG0Z-2ZCW6HS',
                    'email' => 'akhtaruzzamansumon7@gmail.com',
                    'password' => '',
                    'callback_url' => 'http://127.0.0.1:8000/nowpayments/callback',
                    'base_url' => 'https://api.nowpayments.io/v1',
                ],
                'sandbox_data' => [
                    'api_key' => 'RYSKHPP-2VEM33J-NHCEG0Z-2ZCW6HS',
                    'email' => 'akhtaruzzamansumon7@gmail.com',
                    'password' => '',
                    'callback_url' => 'https://swapy.gg/nowpayments/callback',
                    'base_url' => 'https://api-sandbox.nowpayments.io/v1',
                ],
                'is_active' => false,
                'mode' => 'sandbox',
            ],
            [
                'sort_order' => 3,
                'name' => 'Tebex',
                'slug' => 'tebex',
                'icon' => null,
                'is_active' => false,
                'live_data' => [
                    'project_id'   => '1754360',
                    'public_token' => '11lo8-5c79a5f27d3420bd0ea6aec7c07c20724b012474',
                    'private_key' => 'Hqcd4n3CwEmJ6oAltUqQXP3X2EQzstxm',
                    'checkout_url' => 'https://checkout.tebex.io/api',
                ],
                'sandbox_data' => [
                    'project_id'   => '1754360',
                    'public_token' => '11lo8-5c79a5f27d3420bd0ea6aec7c07c20724b012474',
                    'private_key' => 'Hqcd4n3CwEmJ6oAltUqQXP3X2EQzstxm',
                    'checkout_url' => 'https://checkout.tebex.io/api',
                ],
                'mode' => 'sandbox',
            ],
            [
                'sort_order' => 4,
                'name' => 'Swapy Wallet',
                'slug' => 'wallet',
                'icon' => null,
                'is_active' => false,
                'mode' => 'sandbox',
            ],
        ];

        foreach ($gateways as $gateway) {
            PaymentGateway::updateOrCreate(
                ['slug' => $gateway['slug']],
                $gateway
            );
        }
    }
}
