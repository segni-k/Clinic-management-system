<?php

namespace App\Repositories;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AppointmentRepository
{
    public function isSlotBooked(int $doctorId, string $date, string $timeslot, ?int $excludeAppointmentId = null): bool
    {
        $query = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $date)
            ->where('timeslot', $timeslot)
            ->whereIn('status', ['scheduled']);

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }

    public function getTodayAppointments(?int $doctorId = null): LengthAwarePaginator
    {
        $query = Appointment::with(['patient', 'doctor'])
            ->whereDate('appointment_date', Carbon::today())
            ->where('status', 'scheduled')
            ->orderBy('timeslot');

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        return $query->paginate(50);
    }
}
