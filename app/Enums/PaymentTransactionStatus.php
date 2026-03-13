<?php

namespace App\Enums;

enum PaymentTransactionStatus: string
{
    case PENDING = 'pending';
    case SUCCESS = 'success';
    case FAILED = 'failed';
}
