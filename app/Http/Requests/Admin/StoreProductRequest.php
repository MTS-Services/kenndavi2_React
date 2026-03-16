<?php

namespace App\Http\Requests\Admin;

use App\Enums\DiscountType;
use App\Enums\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            /* ── Core ── */
            'title' => ['required', 'string', 'max:255'],

            /*
             * Slug rules:
             *  - required
             *  - max 255 chars
             *  - only lowercase letters, numbers, hyphens and underscores
             *  - must be globally unique across the products table
             */
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9_-]+$/',
                'unique:products,slug',
            ],

            'description' => ['nullable', 'string'],
            'type' => ['required', new Enum(ProductType::class)],

            /* ── Pricing ── */
            'price' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'discount_type' => ['nullable', new Enum(DiscountType::class)],
            'discount_starts_at' => ['nullable', 'date'],
            'discount_ends_at' => ['nullable', 'date', 'after_or_equal:discount_starts_at'],

            /* ── Category ── */
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'integer', 'exists:categories,id'],

            /* ── Images ── */
            'primary_image' => ['nullable', 'image', 'max:10240'],
            'new_images' => ['nullable', 'array'],
            'new_images.*' => ['nullable', 'image', 'max:10240'],

            /* ── Variants matrix ── */
            'variants' => ['nullable', 'array'],
            'variants.*.size' => ['required_with:variants', 'string', 'max:50'],
            'variants.*.color' => ['required_with:variants', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'variants.*.quantity' => ['required_with:variants', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'Slug may only contain lowercase letters, numbers, hyphens (-) and underscores (_).',
            'slug.unique' => 'This slug is already taken. Please choose a different one.',
            'variants.*.color.regex' => 'Each color must be a valid hex code (e.g. #ff0000).',
        ];
    }

    /**
     * Normalise the slug to lowercase before validation runs.
     * This is a safety net – the frontend already enforces this,
     * but server-side we want to be certain.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('slug')) {
            $this->merge([
                'slug' => strtolower(trim($this->slug)),
            ]);
        }
    }
}
