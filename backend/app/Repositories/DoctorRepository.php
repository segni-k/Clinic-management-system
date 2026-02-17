<?php

namespace App\Repositories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Collection;

class DoctorRepository
{
    public function all(): Collection
    {
        return Doctor::orderBy('name')->get();
    }

    public function findById(int $id): ?Doctor
    {
        return Doctor::find($id);
    }

    public function findByUserId(int $userId): ?Doctor
    {
        return Doctor::where('user_id', $userId)->first();
    }

    public function findWithRelations(int $id, array $relations = []): ?Doctor
    {
        return Doctor::with($relations)->find($id);
    }

    public function search(string $query): Collection
    {
        return Doctor::where('name', 'like', "%{$query}%")
            ->orWhere('specialization', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->limit(20)
            ->get();
    }

    public function getBySpecialization(string $specialization): Collection
    {
        return Doctor::where('specialization', $specialization)
            ->orderBy('name')
            ->get();
    }

    public function getAvailableDoctors(): Collection
    {
        return Doctor::whereNotNull('availability')
            ->orderBy('name')
            ->get();
    }
}
