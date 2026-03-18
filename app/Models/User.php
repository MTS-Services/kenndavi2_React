<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\UserStatus;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'created_by',
        'updated_by',
        'deleted_by',
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar',
        'password',
        'gender',
        'dob',
        'status',
        'email_verified_at',
        'remember_token',
        'last_login_at',
        'otp',
        'otp_expire_at',
        'state',
        'city',
        'zip_code',
        'address_line',
        'is_default',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'dob' => 'datetime',
            'last_login_at' => 'datetime',
            'is_default' => 'boolean',
            'gender' => Gender::class,
            'status' => UserStatus::class,
        ];
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: function ($value, array $attributes) {
                $composed = trim(($attributes['first_name'] ?? '').' '.($attributes['last_name'] ?? ''));

                if ($composed !== '') {
                    return $composed;
                }

                return $attributes['email'] ?? '';
            },
        );
    }

    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->avatar) {
            return asset('storage/'.$this->avatar);
        }

        return null;
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function shippingAddresses(): HasMany
    {
        return $this->hasMany(ShippingAddress::class);
    }

    public function otpChallenges(): HasMany
    {
        return $this->hasMany(UserOtpChallenge::class);
    }
}
