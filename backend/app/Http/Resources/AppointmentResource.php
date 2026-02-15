<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'appointment_date' => $this->appointment_date->format('Y-m-d'),
            'timeslot' => $this->timeslot,
            'status' => $this->status,
            'notes' => $this->notes,
            'visit' => new VisitResource($this->whenLoaded('visit')),
        ];
    }
}
