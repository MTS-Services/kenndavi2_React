<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderItemReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:160'],
            'comment' => ['required', 'string', 'min:5', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'rating.required' => 'Please provide a rating.',
            'rating.integer' => 'Rating must be a whole number.',
            'rating.min' => 'Rating must be at least 1 star.',
            'rating.max' => 'Rating cannot be more than 5 stars.',
            'comment.required' => 'Please share your review comment.',
            'comment.min' => 'Review comment must be at least :min characters.',
        ];
    }
}
