<?php

namespace App\Models;

use Database\Factories\BannerImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BannerImage extends Model
{
    /** @use HasFactory<BannerImageFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'banner_id',
        'url',
        'alt_text',
    ];

    public function banner(): BelongsTo
    {
        return $this->belongsTo(Banner::class);
    }
}
