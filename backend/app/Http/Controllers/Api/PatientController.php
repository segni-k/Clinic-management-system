<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function __construct(
        protected PatientService $patientService
    ) {}

    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $this->authorize('viewAny', Patient::class);

        $patients = Patient::with(['creator'])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return PatientResource::collection($patients);
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = $this->patientService->create($request->validated(), $request->user()->id);
        return response()->json(new PatientResource($patient->load('creator')), 201);
    }

    public function show(Patient $patient): PatientResource
    {
        $this->authorize('view', $patient);

        $patient->load([
            'appointments.doctor',
            'visits.doctor',
            'visits.prescriptions.items',
            'invoices.items',
        ]);

        return new PatientResource($patient);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): PatientResource
    {
        $patient = $this->patientService->update($patient, $request->validated());
        return new PatientResource($patient);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $this->authorize('delete', $patient);
        $patient->delete();
        return response()->json(null, 204);
    }

    public function search(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $this->authorize('viewAny', Patient::class);

        $query = $request->get('q', $request->get('phone', ''));
        if (strlen($query) < 2) {
            return PatientResource::collection(collect());
        }

        $patients = $this->patientService->search($query);
        return PatientResource::collection($patients);
    }
}
