<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use App\Services\DoctorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DoctorController extends Controller
{
    public function __construct(
        protected DoctorService $doctorService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Doctor::class);

        $doctors = $this->doctorService->getAll();
        return DoctorResource::collection($doctors);
    }

    public function store(StoreDoctorRequest $request): JsonResponse
    {
        $doctor = $this->doctorService->create($request->validated());
        return response()->json(new DoctorResource($doctor), 201);
    }

    public function show(Doctor $doctor): DoctorResource
    {
        $this->authorize('view', $doctor);
        $doctor->load(['user', 'appointments', 'visits']);
        return new DoctorResource($doctor);
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctor): DoctorResource
    {
        $doctor = $this->doctorService->update($doctor, $request->validated());
        return new DoctorResource($doctor);
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        $this->authorize('delete', $doctor);
        $this->doctorService->delete($doctor);
        return response()->json(null, 204);
    }

    public function search(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Doctor::class);

        $query = $request->get('q', '');
        if (strlen($query) < 2) {
            return DoctorResource::collection(collect());
        }

        $doctors = $this->doctorService->search($query);
        return DoctorResource::collection($doctors);
    }
}
