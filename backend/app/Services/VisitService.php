<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Visit;

class VisitService
{
    public function createFromAppointment(Appointment $appointment, ?int $createdBy = null): Visit
    {
        $appointment->update(['status' => Appointment::STATUS_COMPLETED]);

        return Visit::create([
            'patient_id' => $appointment->patient_id,
            'doctor_id' => $appointment->doctor_id,
            'appointment_id' => $appointment->id,
            'visit_date' => now(),
            'created_by' => $createdBy ?? $appointment->created_by,
        ]);
    }

    public function create(array $data, ?int $createdBy = null): Visit
    {
        $data['created_by'] = $createdBy;
        $data['visit_date'] = $data['visit_date'] ?? now();
        return Visit::create($data);
    }

    public function update(Visit $visit, array $data): Visit
    {
        $visit->update($data);
        return $visit->fresh();
    }
}
