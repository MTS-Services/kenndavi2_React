<?php

namespace App\Http\Requests\Admin;

use App\Enums\DiscountType;
use App\Enums\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /*
         * Unique slug check must ignore the current product's own row.
         * We pull the product from the route model binding.
         */
        $productId = $this->route('product')?->id;

        return [
            /* ── Core ── */
            'title' => ['required', 'string', 'max:255'],

            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9_-]+$/',
                // Unique but ignore the product being edited
                Rule::unique('products', 'slug')->ignore($productId),
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
            'category_id'    => [
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if (! $value || ! $this->type) return;

                    $valid = DB::table('category_types')
                        ->where('category_id', (int) $value)
                        ->where('type', (string) $this->type)
                        ->exists();

                    if (! $valid) {
                        $fail('The selected category does not match the chosen product type.');
                    }
                },
            ],
            'subcategory_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if (! $value || ! $this->category_id) return;

                    $valid = DB::table('category_relations')
                        ->where('category_id',    (int) $this->category_id)
                        ->where('sub_category_id', (int) $value)
                        ->exists();

                    if (! $valid) {
                        $fail('The selected subcategory does not belong to the chosen category.');
                    }
                },
                function ($attribute, $value, $fail) {
                    if (! $value || ! $this->type) return;

                    $valid = DB::table('category_types')
                        ->where('category_id', (int) $value)
                        ->where('type', (string) $this->type)
                        ->exists();

                    if (! $valid) {
                        $fail('The selected subcategory does not match the chosen product type.');
                    }
                },
            ],

            /* ── Images ── */
            'primary_image' => ['nullable', 'image', 'max:10240'],
            'new_images' => ['nullable', 'array'],
            'new_images.*' => ['nullable', 'image', 'max:10240'],
            'removed_image_ids' => ['nullable', 'array'],
            'removed_image_ids.*' => ['integer', 'exists:product_images,id'],

            /* ── Variants matrix ── */
            'variants' => ['nullable', 'array'],
            'variants.*.existingId' => ['nullable', 'integer', 'exists:product_variants,id'],
            'variants.*.size' => ['required_with:variants', 'string', 'max:50'],
            'variants.*.color' => ['required_with:variants', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'variants.*.quantity' => ['required_with:variants', 'integer', 'min:0'],
            'removed_variant_ids' => ['nullable', 'array'],
            'removed_variant_ids.*' => ['integer', 'exists:product_variants,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'Slug may only contain lowercase letters, numbers, hyphens (-) and underscores (_).',
            'slug.unique' => 'This slug is already taken by another product.',
            'variants.*.color.regex' => 'Each color must be a valid hex code (e.g. #ff0000).',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('slug')) {
            $this->merge([
                'slug' => strtolower(trim($this->slug)),
            ]);
        }
    }
}
