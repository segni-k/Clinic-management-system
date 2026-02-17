<?php

namespace App\Services;

use App\Models\Patient;
use App\Repositories\PatientRepository;
use Illuminate\Database\Eloquent\Model;

class PatientService
{
    public function __construct(
        protected PatientRepository $repository
    ) {}

    public function create(array $data, ?int $createdBy = null): Patient
    {
        $data['created_by'] = $createdBy;
        return Patient::create($data);
    }

    public function update(Patient $patient, array $data): Patient
    {
        $patient->update($data);
        return $patient->fresh();
    }

    public function findByPhone(string $phone): ?Patient
    {
        return $this->repository->findByPhone($phone);
    }

    public function search(string $query)
    {
        return $this->repository->search($query);
    }
}
