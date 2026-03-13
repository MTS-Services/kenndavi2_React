<?php

namespace App\Models;

use App\Enums\CategoryStatus;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'sort_order',
        'title',
        'slug',
        'image',
        'description',
        'status',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => CategoryStatus::class,
            'meta_keywords' => 'array',
        ];
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class,
            'category_relations',
            'sub_category_id',
            'category_id',
        );
    }

    public function children(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class,
            'category_relations',
            'category_id',
            'sub_category_id',
        );
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'deleted_by');
    }
}
