<?php

namespace App\Services\Payments\AuthorizeNet;

final class AuthorizeNetWebhookSignature
{
    /**
     * Verify X-ANET-Signature per Authorize.Net webhooks documentation (HMAC-SHA512 of raw body).
     */
    public static function isValid(string $payload, ?string $signatureHeader, string $signatureKeyHex): bool
    {
        if ($signatureHeader === null || $signatureHeader === '' || $signatureKeyHex === '') {
            return false;
        }

        $header = trim($signatureHeader);
        if (str_starts_with(strtolower($header), 'sha512=')) {
            $sent = substr($header, 7);
        } else {
            $sent = $header;
        }

        $sent = strtoupper(trim($sent));

        $binaryKey = @hex2bin($signatureKeyHex);
        if ($binaryKey === false) {
            return false;
        }

        $expected = strtoupper(hash_hmac('sha512', $payload, $binaryKey));

        return hash_equals($expected, $sent);
    }
}
