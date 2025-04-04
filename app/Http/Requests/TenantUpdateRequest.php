<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TenantUpdateRequest extends FormRequest
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
            'tenantEmail' => ['required', 'email', Rule::unique('tenants', 'email')->ignore($this->tenant->id)],
            'tenantDescription' => ['nullable', 'string'],
            'tenantLogoPath' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
