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
                    'webhook_secret' => null,
                ],
                'sandbox_data' => [
                    'public_key' => 'pk_test_51RyARmHCDWKjgteWVY1qf6s0JcQazy1eWTa9UZvfDQfx1z3SetUJNF8v6sLHFRTm1ZPvOjWZgdl4P2Tu9s3TNw1e00HENy5EhS',
                    'secret_key' => 'sk_test_51RyARmHCDWKjgteWucouB1313fWtSqsTmtA8cyjyiJ81YS4JUOGEYKZhaGbzBGMka1eb52CMo1bU9r74O9ICCVWJ00qbt8yfNC',
                    'webhook_secret' => null,
                ],
                'is_active' => false,
                'mode' => 'sandbox',
            ],
            [
                'sort_order' => 2,
                'name' => 'Authorize.Net',
                'slug' => 'authorize_net',
                'icon' => null,
                'live_data' => [],
                'sandbox_data' => [],
                'is_active' => true,
                'mode' => 'sandbox',
            ],
            [
                'sort_order' => 3,
                'name' => 'PayPal',
                'slug' => 'paypal',
                'icon' => null,
                'live_data' => [
                    'client_id' => 'AWT9h3vpTcy1DFl8LYwaig5DWUiE2LOxqrxlTM5d-Vt7jpAaYaaLSVk1Al6RxXBKqPCnfn1QM79qPx3u',
                    'secret_key' => 'EJgLUV9PihD1ZcWMpVywf-8csZiyO2UKww_9DxRpbweop31co8ujf8_0UjHAyEtLGNEBG5UhtFIRFMMv',
                    'webhook_id' => null,
                ],
                'sandbox_data' => [
                    'client_id' => 'AWT9h3vpTcy1DFl8LYwaig5DWUiE2LOxqrxlTM5d-Vt7jpAaYaaLSVk1Al6RxXBKqPCnfn1QM79qPx3u',
                    'secret_key' => 'EJgLUV9PihD1ZcWMpVywf-8csZiyO2UKww_9DxRpbweop31co8ujf8_0UjHAyEtLGNEBG5UhtFIRFMMv',
                    'webhook_id' => null,
                ],
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
