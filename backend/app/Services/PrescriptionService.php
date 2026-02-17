<?php

namespace App\Services;

use App\Models\Prescription;
use App\Models\PrescriptionItem;
use App\Repositories\PrescriptionRepository;
use Illuminate\Database\Eloquent\Collection;

class PrescriptionService
{
    public function __construct(
        protected PrescriptionRepository $repository
    ) {}

    public function create(array $data, ?int $createdBy = null): Prescription
    {
        $prescription = Prescription::create([
            'visit_id' => $data['visit_id'],
            'patient_id' => $data['patient_id'],
            'doctor_id' => $data['doctor_id'],
            'diagnosis' => $data['diagnosis'] ?? null,
            'notes' => $data['notes'] ?? null,
            'status' => $data['status'] ?? 'active',
            'created_by' => $createdBy,
        ]);

        if (!empty($data['items'])) {
            foreach ($data['items'] as $item) {
                PrescriptionItem::create([
                    'prescription_id' => $prescription->id,
                    'medication' => $item['medication'],
                    'dosage' => $item['dosage'],
                    'frequency' => $item['frequency'],
                    'duration' => $item['duration'],
                    'instructions' => $item['instructions'] ?? null,
                ]);
            }
        }

        return $prescription->fresh(['items']);
    }

    public function update(Prescription $prescription, array $data): Prescription
    {
        $prescription->update([
            'diagnosis' => $data['diagnosis'] ?? $prescription->diagnosis,
            'notes' => $data['notes'] ?? $prescription->notes,
            'status' => $data['status'] ?? $prescription->status,
        ]);

        // Update items if provided
        if (isset($data['items'])) {
            // Delete existing items
            $prescription->items()->delete();

            // Create new items
            foreach ($data['items'] as $item) {
                PrescriptionItem::create([
                    'prescription_id' => $prescription->id,
                    'medication' => $item['medication'],
                    'dosage' => $item['dosage'],
                    'frequency' => $item['frequency'],
                    'duration' => $item['duration'],
                    'instructions' => $item['instructions'] ?? null,
                ]);
            }
        }

        return $prescription->fresh(['items']);
    }

    public function getByVisitId(int $visitId): Collection
    {
        return $this->repository->getByVisitId($visitId);
    }

    public function getByPatientId(int $patientId): Collection
    {
        return $this->repository->getByPatientId($patientId);
    }

    public function getActivePrescriptions(int $patientId): Collection
    {
        return $this->repository->getActivePrescriptions($patientId);
    }

    public function updateStatus(Prescription $prescription, string $status): Prescription
    {
        $prescription->update(['status' => $status]);
        return $prescription->fresh();
    }
}
