<?php

namespace App\Enums;

enum VariantStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case OUT_OF_STOCK = 'out_of_stock';
}
