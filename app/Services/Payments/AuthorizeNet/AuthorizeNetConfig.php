<?php

namespace App\Services\Payments\AuthorizeNet;

use App\Enums\MethodModeStatus;
use App\Models\PaymentGateway;
use net\authorize\api\constants\ANetEnvironment;

final class AuthorizeNetConfig
{
    public static function forGateway(?PaymentGateway $gateway): self
    {
        $sandbox = $gateway === null || $gateway->mode === MethodModeStatus::SANDBOX;

        return new self(
            loginId: $sandbox
                ? (string) config('services.authorize_net.sandbox.login_id')
                : (string) config('services.authorize_net.production.login_id'),
            transactionKey: $sandbox
                ? (string) config('services.authorize_net.sandbox.transaction_key')
                : (string) config('services.authorize_net.production.transaction_key'),
            signatureKey: $sandbox
                ? (string) config('services.authorize_net.sandbox.signature_key')
                : (string) config('services.authorize_net.production.signature_key'),
            sandbox: $sandbox,
        );
    }

    public function __construct(
        public readonly string $loginId,
        public readonly string $transactionKey,
        public readonly string $signatureKey,
        public readonly bool $sandbox,
    ) {}

    public function apiEndpoint(): string
    {
        return $this->sandbox
            ? ANetEnvironment::SANDBOX
            : ANetEnvironment::PRODUCTION;
    }

    public function hostedPaymentPostUrl(): string
    {
        return $this->sandbox
            ? 'https://test.authorize.net/payment/payment'
            : 'https://accept.authorize.net/payment/payment';
    }

    public function configured(): bool
    {
        return $this->loginId !== '' && $this->transactionKey !== '';
    }
}
