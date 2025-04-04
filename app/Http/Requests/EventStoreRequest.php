<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class EventStoreRequest extends FormRequest
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
            'title' => ['required'  ,'string' , 'max:255'],
            'description' => ['required'  ,'string' , 'max:255'],
            'start_date' => ['required' , 'date'],
            'end_date' => 'required|date|after_or_equal:start_date',
            'image' => ['required' , 'image' , 'max:2048' , 'mimes:jpeg,png,jpg,gif'],
            'address' => ['required' , 'string' , 'max:255'],
            'num_tickets' => ['required' , 'numeric' , 'min:1'],
            'country_id' => ['required' , 'integer' , Rule::exists('countries' ,'id')],
            'city_id' => ['required' , 'integer' , Rule::exists('cities' ,'id')],
        ];
    }
}
