<?php

namespace App\Repositories;

use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class VisitRepository
{
    public function paginate(int $perPage = 15, ?int $doctorId = null): LengthAwarePaginator
    {
        $query = Visit::with(['patient', 'doctor', 'appointment'])
            ->latest('visit_date');

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Visit
    {
        return Visit::find($id);
    }

    public function findWithRelations(int $id, array $relations = []): ?Visit
    {
        return Visit::with($relations)->find($id);
    }

    public function getByPatientId(int $patientId): Collection
    {
        return Visit::with(['doctor', 'prescriptions'])
            ->where('patient_id', $patientId)
            ->latest('visit_date')
            ->get();
    }

    public function getByDoctorId(int $doctorId, ?string $date = null): Collection
    {
        $query = Visit::with(['patient', 'prescriptions'])
            ->where('doctor_id', $doctorId);

        if ($date) {
            $query->whereDate('visit_date', $date);
        }

        return $query->latest('visit_date')->get();
    }

    public function getTodayVisits(?int $doctorId = null): Collection
    {
        $query = Visit::with(['patient', 'doctor'])
            ->whereDate('visit_date', Carbon::today());

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        return $query->latest('visit_date')->get();
    }

    public function findByAppointmentId(int $appointmentId): ?Visit
    {
        return Visit::where('appointment_id', $appointmentId)->first();
    }
}
