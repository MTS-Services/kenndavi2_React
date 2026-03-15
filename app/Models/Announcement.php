<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'is_active',
        'announcement',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
