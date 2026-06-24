<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeamRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'icon_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'person_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The team member name is required.',
            'name.max' => 'The name must not exceed 255 characters.',
            'title.required' => 'The title is required.',
            'icon_image.image' => 'The icon must be an image file.',
            'icon_image.mimes' => 'The icon must be a file of type: jpg, jpeg, png, webp, svg.',
            'icon_image.max' => 'The icon must not be larger than 2MB.',
            'person_image.image' => 'The person image must be an image file.',
            'person_image.mimes' => 'The person image must be a file of type: jpg, jpeg, png, webp.',
            'person_image.max' => 'The person image must not be larger than 2MB.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}