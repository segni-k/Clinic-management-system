<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'appointment' => new AppointmentResource($this->whenLoaded('appointment')),
            'symptoms' => $this->symptoms,
            'diagnosis' => $this->diagnosis,
            'notes' => $this->notes,
            'visit_date' => $this->visit_date?->toIso8601String(),
            'prescriptions' => PrescriptionResource::collection($this->whenLoaded('prescriptions')),
            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),
        ];
    }
}
