<?php

namespace App\Enums;

enum RefundStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case PROCESSED = 'processed';
    case REJECTED = 'rejected';
}
