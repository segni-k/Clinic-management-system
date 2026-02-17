<?php

namespace App\Repositories;

use App\Models\Prescription;
use Illuminate\Database\Eloquent\Collection;

class PrescriptionRepository
{
    public function findById(int $id): ?Prescription
    {
        return Prescription::find($id);
    }

    public function findWithRelations(int $id, array $relations = []): ?Prescription
    {
        return Prescription::with($relations)->find($id);
    }

    public function getByVisitId(int $visitId): Collection
    {
        return Prescription::with(['items', 'doctor'])
            ->where('visit_id', $visitId)
            ->latest()
            ->get();
    }

    public function getByPatientId(int $patientId): Collection
    {
        return Prescription::with(['items', 'doctor', 'visit'])
            ->where('patient_id', $patientId)
            ->latest()
            ->get();
    }

    public function getActivePrescriptions(int $patientId): Collection
    {
        return Prescription::with(['items', 'doctor'])
            ->where('patient_id', $patientId)
            ->where('status', 'active')
            ->latest()
            ->get();
    }
}
