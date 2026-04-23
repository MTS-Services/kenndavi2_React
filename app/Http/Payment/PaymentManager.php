<?php

namespace App\Http\Payment;

use App\Http\Payment\Methods\AuthorizeNetMethod;
use App\Http\Payment\Methods\PayPalMethod;
use App\Http\Payment\Methods\StripeMethod;
use App\Models\PaymentGateway;
use Illuminate\Support\Collection;

class PaymentManager
{
    protected Collection $paymentMethods;

    public function __construct()
    {
        $this->paymentMethods = collect([
            'stripe' => StripeMethod::class,
            'paypal' => PayPalMethod::class,
            'authorize_net' => AuthorizeNetMethod::class,
        ]);
    }

    public function getPaymentMethods(): Collection
    {
        return $this->paymentMethods;
    }

    public function getPaymentMethod(string $type, ?PaymentGateway $gateway = null): ?PaymentMethod
    {
        $class = $this->paymentMethods->get($type);

        return $class ? app($class, $gateway ? ['gateway' => $gateway] : []) : null;
    }

    public function getPaymentMethodOrFail(string $slug, ?PaymentGateway $gateway = null): PaymentMethod
    {
        abort_if(! $this->paymentMethods->has($slug), 404);

        return $this->getPaymentMethod($slug, $gateway);
    }

    public function hasPaymentMethod(string $slug): bool
    {
        return $this->paymentMethods->has($slug);
    }
}
