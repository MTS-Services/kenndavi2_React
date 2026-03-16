<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Color extends Model
{
    protected $fillable = ['name', 'hex'];

    /* ── Relations ─────────────────────────────────────────────── */

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /* ── Helpers ────────────────────────────────────────────────── */

    /**
     * Find or create a Color by its hex value.
     *
     * @param  string       $hex   e.g. "#ff0000"  (always stored lowercase)
     * @param  string|null  $name  Optional display name; used only on creation
     */
    public static function firstOrCreateByHex(string $hex, ?string $name = null): static
    {
        $hex = strtolower(trim($hex));

        // Normalise: ensure exactly 7 chars  #rrggbb
        if (strlen($hex) === 4) {
            // Short form  #rgb → #rrggbb
            $hex = '#'
                . str_repeat($hex[1], 2)
                . str_repeat($hex[2], 2)
                . str_repeat($hex[3], 2);
        }

        return static::firstOrCreate(
            ['hex' => $hex],
            ['name' => $name ?? $hex],
        );
    }
}