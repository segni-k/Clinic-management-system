<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePrescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isDoctor() || $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'diagnosis' => ['sometimes', 'string'],
            'notes' => ['sometimes', 'string'],
            'status' => ['sometimes', 'string', 'in:active,completed,cancelled'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.medication' => ['required_with:items', 'string', 'max:255'],
            'items.*.dosage' => ['required_with:items', 'string', 'max:255'],
            'items.*.frequency' => ['required_with:items', 'string', 'max:255'],
            'items.*.duration' => ['required_with:items', 'string', 'max:255'],
            'items.*.instructions' => ['nullable', 'string'],
        ];
    }
}
