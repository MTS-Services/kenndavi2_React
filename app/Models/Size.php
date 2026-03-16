<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Size extends Model
{
    protected $fillable = ['name', 'sort_order'];

    /* ── Relations ─────────────────────────────────────────────── */

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /* ── Helpers ────────────────────────────────────────────────── */

    /**
     * Find or create a Size by its display name.
     *
     * Names are stored in uppercase for consistency (S, M, L, XL, 40 …).
     */
    public static function firstOrCreateByName(string $name): static
    {
        $name = strtoupper(trim($name));

        return static::firstOrCreate(
            ['name' => $name],
        );
    }
}
