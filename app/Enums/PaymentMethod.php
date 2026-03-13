<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case STRIPE = 'stripe';
    case BKASH = 'bkash';
    case COD = 'cod';
}
