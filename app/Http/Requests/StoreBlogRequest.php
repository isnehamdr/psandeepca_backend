<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
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
            //

            'title'   => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status'  => 'required|in:draft,published',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'   => 'A blog title is required.',
            'content.required' => 'Blog content cannot be empty.',
            'status.in'        => 'Status must be either draft or published.',
        ];
    }

}
