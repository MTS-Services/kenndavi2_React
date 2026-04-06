<?php

namespace App\Models;

use App\Enums\MethodModeStatus;
use App\Http\Payment\PaymentManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'sort_order',
        'name',
        'slug',
        'icon',
        'is_active',
        'live_data',
        'sandbox_data',
        'mode',

        'updated_by',
    ];

    protected $hidden = [
        'updated_by',
        'id',
        'live_data',
        'sandbox_data',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'mode' => MethodModeStatus::class,
        'live_data' => 'encrypted:array',
        'sandbox_data' => 'encrypted:array',
    ];

    /* =#=#=#=#=#=#=#=#=#=#==#=#=#=#= =#=#=#=#=#=#=#=#=#=#==#=#=#=#=
                Start of RELATIONSHIPS
     =#=#=#=#=#=#=#=#=#=#==#=#=#=#= =#=#=#=#=#=#=#=#=#=#==#=#=#=#= */

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /* =#=#=#=#=#=#=#=#=#=#==#=#=#=#= =#=#=#=#=#=#=#=#=#=#==#=#=#=#=
                End of RELATIONSHIPS
     =#=#=#=#=#=#=#=#=#=#==#=#=#=#= =#=#=#=#=#=#=#=#=#=#==#=#=#=#= */

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->appends = array_merge(parent::getAppends(), [
            //
        ]);
    }

    /**
     * Get the active credentials array based on current mode.
     *
     * @return array<string, mixed>
     */
    public function getCredentials(): array
    {
        return $this->mode === MethodModeStatus::LIVE
            ? ($this->live_data ?? [])
            : ($this->sandbox_data ?? []);
    }

    /**
     * Retrieve a single credential value by key.
     */
    public function getCredential(string $key, mixed $default = null): mixed
    {
        return $this->getCredentials()[$key] ?? $default;
    }

    /**
     * Find a gateway by slug with caching (1 hour TTL).
     */
    public static function findBySlugCached(string $slug): ?static
    {
        return Cache::remember(
            "payment_gateway.{$slug}",
            3600,
            fn() => static::where('slug', $slug)->first()
        );
    }

    /**
     * Bust the cache for this gateway after updates.
     */
    protected static function booted(): void
    {
        static::saved(function (PaymentGateway $gateway) {
            Cache::forget("payment_gateway.{$gateway->slug}");
            Cache::forget('payment_gateways.all_active');
        });
    }

    /**
     * Get all active gateways (cached).
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, static>
     */
    public static function allActiveCached(): \Illuminate\Database\Eloquent\Collection
    {
        return Cache::remember(
            'payment_gateways.all_active',
            3600,
            fn() => static::enabled()->get()
        );
    }

    public function paymentMethod()
    {
        return app(PaymentManager::class)->getPaymentMethodOrFail($this->slug, $this);
    }

    public function isSupported(): bool
    {
        return app(PaymentManager::class)->hasPaymentMethod($this->slug);
    }

    public function scopeEnabled(Builder $query): void
    {
        $query->where('is_active', true)->orderBy('sort_order', 'asc');
    }
}
