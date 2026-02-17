<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected UserRepository $repository
    ) {}

    public function login(string $email, string $password): array
    {
        if (!Auth::attempt(['email' => $email, 'password' => $password])) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $user->tokens()->delete(); // Revoke all previous tokens
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user->load(['role', 'doctor']),
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function register(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return User::create($data);
    }

    public function getCurrentUser(): ?User
    {
        return Auth::user()?->load(['role', 'doctor']);
    }

    public function getUserById(int $id): ?User
    {
        return $this->repository->findWithRelations($id, ['role', 'doctor']);
    }

    public function refreshToken(User $user): string
    {
        $user->tokens()->delete();
        return $user->createToken('auth-token')->plainTextToken;
    }
}
