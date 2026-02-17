<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function findWithRelations(int $id, array $relations = []): ?User
    {
        return User::with($relations)->find($id);
    }

    public function getByRole(int $roleId): Collection
    {
        return User::where('role_id', $roleId)
            ->orderBy('name')
            ->get();
    }

    public function getAllWithRoles(): Collection
    {
        return User::with(['role', 'doctor'])
            ->orderBy('name')
            ->get();
    }

    public function search(string $query): Collection
    {
        return User::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->with(['role', 'doctor'])
            ->limit(20)
            ->get();
    }
}
