<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Hero title is required.',
            'image.image' => 'Please upload a valid image.',
            'is_active.required' => 'Status is required.',
        ];
    }
}