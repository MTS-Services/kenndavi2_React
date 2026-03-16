<?php

namespace App\Models;

use App\Enums\VariantStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'color_id',
        'size_id',
        'quantity',   // ← added
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => VariantStatus::class,
            'quantity' => 'integer',
        ];
    }

    /* ── Relations ─────────────────────────────────────────────── */

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class, 'variant_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'variant_id');
    }

    /* ── Helpers ────────────────────────────────────────────────── */

    /**
     * Safely decrement stock after a purchase.
     * Returns false if there is insufficient stock.
     */
    public function decrementStock(int $qty): bool
    {
        if ($this->quantity < $qty) {
            return false;
        }

        $this->decrement('quantity', $qty);

        return true;
    }

    /**
     * Increment stock (e.g. after a return or restock).
     */
    public function incrementStock(int $qty): void
    {
        $this->increment('quantity', $qty);
    }
}
