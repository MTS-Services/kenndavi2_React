<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreShippingAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['nullable', 'string', 'max:120'],
            'email' => ['required', 'string', 'email:rfc', 'max:191'],
            'phone' => ['required', 'string', 'max:20'],
            'state' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'zip_code' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:100'],
            'save_as_default' => ['sometimes', 'boolean'],
        ];
    }
}
