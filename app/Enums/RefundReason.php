<?php

namespace App\Enums;

enum RefundReason: string
{
    case DEFECTIVE = 'defective';
    case WRONG_ITEM = 'wrong_item';
    case CUSTOMER_REQUEST = 'customer_request';
    case OTHER = 'other';
}
