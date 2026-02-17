<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->validated('email'),
                $request->validated('password')
            );

            return response()->json([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
                'token_type' => $result['token_type'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }

    public function logout(): JsonResponse
    {
        $user = $this->authService->getCurrentUser();
        if ($user) {
            $this->authService->logout($user);
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(): JsonResponse
    {
        $user = $this->authService->getCurrentUser();
        return response()->json(new UserResource($user));
    }
}
