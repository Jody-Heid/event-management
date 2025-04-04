<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TenantStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tenantName' => ['required', 'string'],
            'tenantDescription' => ['nullable', 'string'],
            'tenantLogoPath' => ['nullable', 'image', 'max:2048'],
            'userFullName' => ['required', 'string'],
            'userEmail' => ['required', 'email', 'unique:users,email'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
