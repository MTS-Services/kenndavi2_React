<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'authorize_net' => [
        'public_base_url' => env('AUTHORIZE_NET_PUBLIC_BASE_URL', env('APP_URL')),
        'sandbox' => [
            'login_id' => env('AUTHORIZE_NET_SANDBOX_LOGIN_ID'),
            'transaction_key' => env('AUTHORIZE_NET_SANDBOX_TRANSACTION_KEY'),
            'signature_key' => env('AUTHORIZE_NET_SANDBOX_SIGNATURE_KEY'),
        ],
        'production' => [
            'login_id' => env('AUTHORIZE_NET_LOGIN_ID'),
            'transaction_key' => env('AUTHORIZE_NET_TRANSACTION_KEY'),
            'signature_key' => env('AUTHORIZE_NET_SIGNATURE_KEY'),
        ],
    ],
];
