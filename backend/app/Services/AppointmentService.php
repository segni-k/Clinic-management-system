<?php

namespace App\Services;

use App\Models\Appointment;
use App\Repositories\AppointmentRepository;
use Illuminate\Validation\ValidationException;

class AppointmentService
{
    public function __construct(
        protected AppointmentRepository $repository
    ) {}

    public function create(array $data, ?int $createdBy = null): Appointment
    {
        if ($this->repository->isSlotBooked(
            $data['doctor_id'],
            $data['appointment_date'],
            $data['timeslot']
        )) {
            throw ValidationException::withMessages([
                'timeslot' => ['This timeslot is already booked for the selected doctor.'],
            ]);
        }

        $data['created_by'] = $createdBy;
        $data['status'] = Appointment::STATUS_SCHEDULED;
        return Appointment::create($data);
    }

    public function updateStatus(Appointment $appointment, string $status): Appointment
    {
        $appointment->update(['status' => $status]);
        return $appointment->fresh();
    }

    public function isSlotBooked(int $doctorId, string $date, string $timeslot, ?int $excludeId = null): bool
    {
        return $this->repository->isSlotBooked($doctorId, $date, $timeslot, $excludeId);
    }
}
