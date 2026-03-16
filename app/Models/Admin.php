<?php

namespace App\Models;

use App\Enums\AdminRole;
use App\Enums\AdminStatus;
use App\Enums\Gender;
use Database\Factories\AdminFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    /** @use HasFactory<AdminFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'avatar',
        'gender',
        'dob',
        'role',
        'status',
        'email_verified_at',
        'remember_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'dob' => 'date',
            'email_verified_at' => 'datetime',
            'gender' => Gender::class,
            'role' => AdminRole::class,
            'status' => AdminStatus::class,
        ];
    }

    public function categoriesCreated(): HasMany
    {
        return $this->hasMany(Category::class, 'created_by');
    }

    public function productsCreated(): HasMany
    {
        return $this->hasMany(Product::class, 'created_by');
    }

    public function bannersCreated(): HasMany
    {
        return $this->hasMany(Banner::class, 'created_by');
    }
}
