<?php

namespace App\Http\Payment;

use App\Models\Order;
use App\Models\PaymentGateway;

abstract class PaymentMethod
{
    protected $name;

    protected ?PaymentGateway $gateway;

    protected $requiresFrontendJs = false;

    protected $jsSDKUrl = null;

    public function __construct(?PaymentGateway $gateway)
    {
        $this->gateway = $gateway;
    }

    abstract public function startPayment(Order $order, array $paymentData = []);

    public function confirmPayment(string $transactionId, ?string $paymentMethodId = null): array
    {
        return [
            'success' => false,
            'message' => __('This payment method does not support confirmation.'),
        ];
    }

    public function handleWebhook(array $payload): void
    {
        // Override in child class if webhook support is needed
    }

    public function updateOrder(Order $order, array $updatedData): bool
    {
        return $order->update($updatedData);
    }

    public function requiresFrontendJs(): bool
    {
        return $this->requiresFrontendJs;
    }

    public function getJsSDKUrl(): ?string
    {
        return $this->jsSDKUrl;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getGateway(): ?PaymentGateway
    {
        return $this->gateway;
    }
}
