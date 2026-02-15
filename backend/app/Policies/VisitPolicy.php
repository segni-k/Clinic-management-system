<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Visit;

class VisitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isDoctor() || $user->isReceptionist();
    }

    public function view(User $user, Visit $visit): bool
    {
        if ($user->isAdmin() || $user->isReceptionist()) {
            return true;
        }
        if ($user->isDoctor() && $user->doctor) {
            return $visit->doctor_id === $user->doctor->id;
        }
        return false;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isDoctor() || $user->isReceptionist();
    }

    public function update(User $user, Visit $visit): bool
    {
        return $user->isAdmin() || $user->isDoctor() || $user->isReceptionist();
    }

    public function delete(User $user, Visit $visit): bool
    {
        return $user->isAdmin();
    }
}
