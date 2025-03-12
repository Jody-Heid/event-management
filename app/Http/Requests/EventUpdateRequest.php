<?php

namespace App\Http\Requests;

use App\Enums\EventTypeEnum;
use App\Enums\EventStatusEnum;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class EventUpdateRequest extends FormRequest
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
            'tenant_id' => ['nullable' , 'integer' , Rule::exists('tenants' ,'id')],
            'name' => ['required'  ,'string' , 'max:255'],
            'description' => ['required'  ,'string' , 'max:255'],
            'start_time' => ['required' , 'date'],
            'end_time' => ['required' , 'date'],
            'location' => ['required' , 'string'],
            'status' => ['required' , new Enum(EventStatusEnum::class)],
            'event_type' => ['required' , new Enum(EventTypeEnum::class)],
            'ticket_price' => ['nullable' , 'numeric'],
            'ticket_limit' => ['nullable' , 'integer'],
            'ticket_limit_per_user' => ['nullable' , 'integer'],
        ];
    }
}
