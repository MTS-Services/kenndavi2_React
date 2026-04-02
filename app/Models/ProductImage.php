<?php

namespace App\Models;

use Database\Factories\ProductImageFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    /** @use HasFactory<ProductImageFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'product_id',
        'color_id',
        'url',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected $appends = [
        'http_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    public function getHttpUrlAttribute(): ?string
    {
        if (! is_string($this->url) || $this->url === '' || $this->url === null) {
            return null;
        }

        if (filter_var($this->url, FILTER_VALIDATE_URL) && (str_starts_with($this->url, 'https://') || str_starts_with($this->url, 'http://'))) {
            return $this->url;
        }

        return Storage::disk('public')->url($this->url ?? null);
    }

    public function scopePrimary(Builder $query): Builder
    {
        return $query->where('is_primary', true);
    }
}
