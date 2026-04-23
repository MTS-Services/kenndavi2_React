<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethod as PaymentMethodEnum;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AuthorizeNetRelayController extends Controller
{
    public function __invoke(Request $request, Payment $payment): View
    {
        abort_unless($request->hasValidSignature(), 403);

        if (! $request->user() || (int) $request->user()->id !== (int) $payment->order?->user_id) {
            abort(403);
        }

        abort_unless($payment->method === PaymentMethodEnum::AUTHORIZE_NET, 404);
        abort_unless($payment->status === PaymentStatus::PENDING, 410);

        $decoded = json_decode((string) $payment->gateway_response, true);
        if (! is_array($decoded)) {
            abort(410);
        }

        $token = (string) ($decoded['accept_hosted_token'] ?? '');
        $postUrl = (string) ($decoded['accept_hosted_post_url'] ?? '');
        if ($token === '' || $postUrl === '') {
            abort(410);
        }

        return view('payments.authorize-net-relay', [
            'postUrl' => $postUrl,
            'token' => $token,
        ]);
    }
}
