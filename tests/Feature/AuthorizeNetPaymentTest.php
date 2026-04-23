<?php

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;

it('accept hosted relay shows auto post form for pending authorize net payment', function () {
    $user = User::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'order_number' => 'ORD-ANET-TEST-1',
        'grand_total' => 25.50,
        'status' => OrderStatus::INITIALIZED,
        'payment_status' => OrderPaymentStatus::UNPAID,
    ]);

    $payment = Payment::factory()->create([
        'order_id' => $order->id,
        'method' => PaymentMethod::AUTHORIZE_NET->value,
        'status' => PaymentStatus::PENDING->value,
        'amount' => 25.50,
        'gateway_response' => json_encode([
            'accept_hosted_token' => 'test-token-value',
            'accept_hosted_post_url' => 'https://test.authorize.net/payment/payment',
        ], JSON_THROW_ON_ERROR),
    ]);

    $url = URL::temporarySignedRoute(
        'payment.authorize-net.relay',
        now()->addMinutes(10),
        ['payment' => $payment->id],
    );

    $this->actingAs($user)
        ->get($url)
        ->assertOk()
        ->assertSee('https://test.authorize.net/payment/payment', false)
        ->assertSee('test-token-value', false)
        ->assertSee('anet-relay-form', false);
});

it('authorize net webhook completes payment and marks order paid', function () {
    PaymentGateway::query()->create([
        'sort_order' => 5,
        'name' => 'Authorize.Net',
        'slug' => 'authorize_net',
        'icon' => null,
        'is_active' => true,
        'live_data' => [],
        'sandbox_data' => [],
        'mode' => 'sandbox',
        'updated_by' => null,
    ]);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'order_number' => 'ORD-ANET-WH-1',
        'grand_total' => 10.00,
        'status' => OrderStatus::INITIALIZED,
        'payment_status' => OrderPaymentStatus::UNPAID,
    ]);

    $payment = Payment::factory()->create([
        'order_id' => $order->id,
        'method' => PaymentMethod::AUTHORIZE_NET->value,
        'status' => PaymentStatus::PENDING->value,
        'amount' => 10.00,
    ]);

    $notificationId = '550e8400-e29b-41d4-a716-446655440000';

    $payload = [
        'notificationId' => $notificationId,
        'eventType' => 'net.authorize.payment.authcapture.created',
        'eventDate' => now()->toIso8601String(),
        'payload' => [
            'responseCode' => 1,
            'merchantReferenceId' => (string) $payment->id,
            'id' => '60020981676',
            'entityName' => 'transaction',
        ],
    ];

    $this->postJson('/webhooks/authorize-net', $payload)->assertOk();

    $payment->refresh();
    $order->refresh();

    expect($payment->status)->toBe(PaymentStatus::COMPLETED)
        ->and($payment->gateway_txn_id)->toBe('60020981676')
        ->and($order->payment_status)->toBe(OrderPaymentStatus::PAID)
        ->and($order->status)->toBe(OrderStatus::PENDING);

    $this->postJson('/webhooks/authorize-net', $payload)->assertOk();

    expect(DB::table('payment_webhook_events')->where('provider', 'authorize_net')->count())->toBe(1);
});
