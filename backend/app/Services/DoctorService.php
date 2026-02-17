<?php

namespace App\Services;

use App\Models\Doctor;
use App\Repositories\DoctorRepository;
use Illuminate\Database\Eloquent\Collection;

class DoctorService
{
    public function __construct(
        protected DoctorRepository $repository
    ) {}

    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    public function create(array $data): Doctor
    {
        return Doctor::create($data);
    }

    public function update(Doctor $doctor, array $data): Doctor
    {
        $doctor->update($data);
        return $doctor->fresh();
    }

    public function delete(Doctor $doctor): bool
    {
        return $doctor->delete();
    }

    public function findById(int $id): ?Doctor
    {
        return $this->repository->findById($id);
    }

    public function findByUserId(int $userId): ?Doctor
    {
        return $this->repository->findByUserId($userId);
    }

    public function search(string $query): Collection
    {
        return $this->repository->search($query);
    }

    public function getBySpecialization(string $specialization): Collection
    {
        return $this->repository->getBySpecialization($specialization);
    }

    public function getAvailableDoctors(): Collection
    {
        return $this->repository->getAvailableDoctors();
    }
}
