<?php

namespace App\Enums;

enum AdminRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case STAFF = 'staff';
    case CUSTOMER = 'customer';
}
