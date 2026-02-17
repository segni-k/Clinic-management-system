<?php

namespace App\Repositories;

use App\Models\Patient;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PatientRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Patient::with(['creator'])
            ->latest()
            ->paginate($perPage);
    }

    public function findByPhone(string $phone): ?Patient
    {
        return Patient::where('phone', $phone)->first();
    }

    public function search(string $query): Collection
    {
        return Patient::where('first_name', 'like', "%{$query}%")
            ->orWhere('last_name', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->limit(20)
            ->get();
    }

    public function findWithRelations(int $id, array $relations = []): ?Patient
    {
        return Patient::with($relations)->find($id);
    }
}
