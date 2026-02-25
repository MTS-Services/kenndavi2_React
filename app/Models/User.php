<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'avatar',
        'password',
        'is_admin',
        'has_completed_onboarding',
        'created_at',
        'updated_at',
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
            'two_factor_confirmed_at' => 'datetime',
            'is_admin' => 'boolean',
            'has_completed_onboarding' => 'boolean',
            'is_payroll' => 'boolean',
            'is_trusted' => 'boolean',
            'is_private' => 'boolean',
            'is_hidden' => 'boolean',
            'activated' => 'boolean',
            'is_active' => 'boolean',
            'hours_preferred' => 'decimal:2',
            'hours_max' => 'decimal:2',
            'hourly_rate' => 'decimal:2',
            'start_date' => 'date',
            'hired_on' => 'datetime',
            'terminated_at' => 'datetime',
            'last_login' => 'datetime',
            'alert_settings' => 'array',
            'positions' => 'array',
            'locations' => 'array',
            'avatar_urls' => 'array',
        ];
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: function ($value, array $attributes) {
                $storedName = $attributes['name'] ?? $value;

                if (! empty($storedName)) {
                    return $storedName;
                }

                $composed = trim(($attributes['first_name'] ?? '').' '.($attributes['last_name'] ?? ''));

                return $composed !== '' ? $composed : ($attributes['email'] ?? '');
            },
        );
    }

    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    public function getRoleLabelAttribute(): string
    {
        return $this->role?->label() ?? 'Unknown';
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN || $this->is_admin === true;
    }

    public function isUser(): bool
    {
        return $this->role === UserRole::USER;
    }

    public function canManageUsers(): bool
    {
        return $this->isAdmin();
    }

    public function getCanManageUsersAttribute(): bool
    {
        return $this->canManageUsers();
    }

    public function canAccessPayroll(): bool
    {
        return $this->role?->canAccessPayroll() ?? false;
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->avatar_urls && isset($this->avatar_urls['url'])) {
            return str_replace('%s', 'medium', $this->avatar_urls['url']);
        }

        if ($this->avatar) {
            return asset('storage/'.$this->avatar);
        }

        return null;
    }

    public static function syncFromWhenIWorkData(array $userData, string $token): self
    {
        $user = static::updateOrCreate(
            ['wheniwork_id' => $userData['id']],
            [
                'account_id' => $userData['account_id'] ?? null,
                'login_id' => $userData['login_id'] ?? null,
                'wheniwork_token' => $token,
                'email' => $userData['email'],
                'first_name' => $userData['first_name'] ?? '',
                'middle_name' => $userData['middle_name'] ?? null,
                'last_name' => $userData['last_name'] ?? '',
                'phone_number' => $userData['phone_number'] ?? null,
                'employee_code' => $userData['employee_code'] ?? null,
                'role' => $userData['role'] ?? 3,
                'employment_type' => $userData['employment_type'] ?? 'hourly',
                'is_payroll' => $userData['is_payroll'] ?? false,
                'is_trusted' => $userData['is_trusted'] ?? false,
                'is_private' => $userData['is_private'] ?? true,
                'is_hidden' => $userData['is_hidden'] ?? false,
                'activated' => $userData['activated'] ?? false,
                'is_active' => $userData['is_active'] ?? true,
                'hours_preferred' => $userData['hours_preferred'] ?? 0,
                'hours_max' => $userData['hours_max'] ?? 0,
                'hourly_rate' => $userData['hourly_rate'] ?? 0,
                'notes' => $userData['notes'] ?? null,
                'uuid' => $userData['uuid'] ?? null,
                'timezone_name' => $userData['timezone_name'] ?? null,
                'start_date' => ! empty($userData['start_date']) ? $userData['start_date'] : null,
                'hired_on' => ! empty($userData['hired_on']) ? $userData['hired_on'] : null,
                'terminated_at' => ! empty($userData['terminated_at']) ? $userData['terminated_at'] : null,
                'last_login' => now(),
                'alert_settings' => $userData['alert_settings'] ?? null,
                'positions' => $userData['positions'] ?? [],
                'locations' => $userData['locations'] ?? [],
                'avatar_urls' => $userData['avatar'] ?? null,
                'is_admin' => ($userData['role'] ?? 3) === 1,
            ]
        );

        return $user;
    }
}
