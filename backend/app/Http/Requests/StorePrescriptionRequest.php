<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isDoctor() || $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'visit_id' => ['required', 'exists:visits,id'],
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'diagnosis' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:active,completed,cancelled'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.medication' => ['required', 'string', 'max:255'],
            'items.*.dosage' => ['required', 'string', 'max:255'],
            'items.*.frequency' => ['required', 'string', 'max:255'],
            'items.*.duration' => ['required', 'string', 'max:255'],
            'items.*.instructions' => ['nullable', 'string'],
        ];
    }
}
