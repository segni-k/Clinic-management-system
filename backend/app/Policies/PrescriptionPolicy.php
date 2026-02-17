<?php

namespace App\Policies;

use App\Models\Prescription;
use App\Models\User;

class PrescriptionPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view prescriptions
    }

    public function view(User $user, Prescription $prescription): bool
    {
        // Doctors can view their own prescriptions
        if ($user->isDoctor() && $user->doctor?->id === $prescription->doctor_id) {
            return true;
        }

        // Admins and receptionists can view all
        return $user->isAdmin() || $user->isReceptionist();
    }

    public function create(User $user): bool
    {
        return $user->isDoctor() || $user->isAdmin();
    }

    public function update(User $user, Prescription $prescription): bool
    {
        // Doctors can update their own prescriptions
        if ($user->isDoctor() && $user->doctor?->id === $prescription->doctor_id) {
            return true;
        }

        // Admins can update any prescription
        return $user->isAdmin();
    }

    public function delete(User $user, Prescription $prescription): bool
    {
        // Only admins can delete prescriptions
        return $user->isAdmin();
    }
}
