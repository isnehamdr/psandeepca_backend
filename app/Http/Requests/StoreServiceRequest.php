<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
             'title'             => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'description'       => 'nullable|string',
            'detail'            => 'nullable|string',
            'icon'              => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'image'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active'         => 'required|in:draft,published',

            'sort_order'        => 'required|integer',
        ];
    }

     public function messages(): array
    {
        return [
            'title.required' => 'The service title is required.',
            'icon.image'      => 'The icon must be a valid image file.',
            'image.image'     => 'The image must be a valid image file.',
        ];
    }
}
