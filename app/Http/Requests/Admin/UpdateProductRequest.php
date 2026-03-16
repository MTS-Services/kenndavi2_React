<?php

namespace App\Http\Requests\Admin;

use App\Enums\DiscountType;
use App\Enums\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            /* ── Core ── */
            'title'                    => ['required', 'string', 'max:255'],
            'description'              => ['nullable', 'string'],
            'type'                     => ['required', new Enum(ProductType::class)],

            /* ── Pricing ── */
            'price'                    => ['required', 'numeric', 'min:0'],
            'discount'                 => ['nullable', 'numeric', 'min:0'],
            'discount_type'            => ['nullable', new Enum(DiscountType::class)],
            'discount_starts_at'       => ['nullable', 'date'],
            'discount_ends_at'         => ['nullable', 'date', 'after_or_equal:discount_starts_at'],

            /* ── Category ── */
            'category_id'              => ['nullable', 'integer', 'exists:categories,id'],
            'subcategory_id'           => ['nullable', 'integer', 'exists:categories,id'],

            /* ── Images ── */
            'primary_image'            => ['nullable', 'image', 'max:10240'],
            'new_images'               => ['nullable', 'array'],
            'new_images.*'             => ['nullable', 'image', 'max:10240'],
            'removed_image_ids'        => ['nullable', 'array'],
            'removed_image_ids.*'      => ['integer', 'exists:product_images,id'],

            /* ── Variants matrix ── */
            'variants'                 => ['nullable', 'array'],
            'variants.*.existingId'    => ['nullable', 'integer', 'exists:product_variants,id'],
            'variants.*.size'          => ['required_with:variants', 'string', 'max:50'],
            'variants.*.color'         => ['required_with:variants', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'variants.*.quantity'      => ['required_with:variants', 'integer', 'min:0'],
            'removed_variant_ids'      => ['nullable', 'array'],
            'removed_variant_ids.*'    => ['integer', 'exists:product_variants,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'variants.*.color.regex' => 'Each color must be a valid hex code (e.g. #ff0000).',
        ];
    }
}
