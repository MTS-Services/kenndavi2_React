<?php

namespace App\Services\Payments\AuthorizeNet;

use App\Models\Order;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\Log;
use net\authorize\api\contract\v1\GetHostedPaymentPageRequest;
use net\authorize\api\contract\v1\GetHostedPaymentPageResponse;
use net\authorize\api\contract\v1\MerchantAuthenticationType;
use net\authorize\api\contract\v1\OrderType;
use net\authorize\api\contract\v1\SettingType;
use net\authorize\api\contract\v1\TransactionRequestType;
use net\authorize\api\controller\GetHostedPaymentPageController;

class AcceptHostedTokenService
{
    /**
     * @return array{token: string, post_url: string}
     *
     * @throws Exception
     */
    public function requestHostedFormToken(
        AuthorizeNetConfig $config,
        Order $order,
        Payment $payment,
        string $returnUrl,
        string $cancelUrl,
    ): array {
        if (! $config->configured()) {
            throw new Exception('Authorize.Net API credentials are not configured.');
        }

        if (! str_starts_with($returnUrl, 'http://') && ! str_starts_with($returnUrl, 'https://')) {
            throw new Exception('Invalid success URL. Expected absolute http(s) URL.');
        }

        if (! str_starts_with($cancelUrl, 'http://') && ! str_starts_with($cancelUrl, 'https://')) {
            throw new Exception('Invalid cancel URL. Expected absolute http(s) URL.');
        }

        // Log::info('Authorize.Net return URLs', [
        //     'order_number' => $order->order_number,
        //     'return_url' => $returnUrl,
        //     'cancel_url' => $cancelUrl,
        // ]);

        $merchantAuthentication = new MerchantAuthenticationType;
        $merchantAuthentication->setName($config->loginId);
        $merchantAuthentication->setTransactionKey($config->transactionKey);

        $orderType = new OrderType;
        $orderType->setInvoiceNumber($order->order_number);
        $orderType->setDescription(sprintf('%s order %s', config('app.name'), $order->order_number));

        $transactionRequest = new TransactionRequestType;
        $transactionRequest->setTransactionType('authCaptureTransaction');
        $transactionRequest->setAmount((float) $payment->amount);
        $transactionRequest->setOrder($orderType);

        $returnOptions = new SettingType;
        $returnOptions->setSettingName('hostedPaymentReturnOptions');
        $returnOptions->setSettingValue(json_encode([
            'showReceipt' => true,
            'url' => $returnUrl,
            'urlText' => __('Continue'),
            'cancelUrl' => $cancelUrl,
            'cancelUrlText' => __('Cancel'),
        ], JSON_THROW_ON_ERROR));

        $orderOptions = new SettingType;
        $orderOptions->setSettingName('hostedPaymentOrderOptions');
        $orderOptions->setSettingValue(json_encode([
            'show' => true,
            'merchantName' => (string) config('app.name'),
        ], JSON_THROW_ON_ERROR));

        $request = new GetHostedPaymentPageRequest;
        $request->setMerchantAuthentication($merchantAuthentication);
        $request->setTransactionRequest($transactionRequest);
        $request->setRefId((string) $payment->id);
        $request->addToHostedPaymentSettings($returnOptions);
        $request->addToHostedPaymentSettings($orderOptions);

        $controller = new GetHostedPaymentPageController($request);
        /** @var GetHostedPaymentPageResponse $response */
        $response = $controller->executeWithApiResponse($config->apiEndpoint());

        if ($response === null) {
            throw new Exception('Authorize.Net returned an empty response.');
        }

        $messages = $response->getMessages();
        $resultCode = $messages?->getResultCode();
        if ($resultCode !== 'Ok') {
            $text = '';
            foreach ($messages?->getMessage() ?? [] as $msg) {
                $text .= (string) $msg->getText().' ';
            }

            throw new Exception(trim($text) ?: 'Authorize.Net getHostedPaymentPage failed.');
        }

        $token = (string) $response->getToken();
        if ($token === '') {
            throw new Exception('Authorize.Net did not return a hosted payment token.');
        }

        return [
            'token' => $token,
            'post_url' => $config->hostedPaymentPostUrl(),
        ];
    }
}
