<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePrescriptionRequest;
use App\Http\Requests\UpdatePrescriptionRequest;
use App\Http\Resources\PrescriptionResource;
use App\Models\Prescription;
use App\Services\PrescriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function __construct(
        protected PrescriptionService $prescriptionService
    ) {}

    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $this->authorize('viewAny', Prescription::class);

        $query = Prescription::with(['patient', 'doctor', 'visit', 'items']);

        if ($request->user()->isDoctor() && $request->user()->doctor) {
            $query->where('doctor_id', $request->user()->doctor->id);
        }

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->get('patient_id'));
        }

        if ($request->has('visit_id')) {
            $query->where('visit_id', $request->get('visit_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $prescriptions = $query->latest()->paginate($request->get('per_page', 15));

        return PrescriptionResource::collection($prescriptions);
    }

    public function store(StorePrescriptionRequest $request): JsonResponse
    {
        $prescription = $this->prescriptionService->create($request->validated(), $request->user()->id);
        return response()->json(new PrescriptionResource($prescription->load(['patient', 'doctor', 'items'])), 201);
    }

    public function show(Prescription $prescription): PrescriptionResource
    {
        $this->authorize('view', $prescription);
        $prescription->load(['patient', 'doctor', 'visit', 'items']);
        return new PrescriptionResource($prescription);
    }

    public function update(UpdatePrescriptionRequest $request, Prescription $prescription): PrescriptionResource
    {
        $prescription = $this->prescriptionService->update($prescription, $request->validated());
        return new PrescriptionResource($prescription->load(['patient', 'doctor', 'items']));
    }

    public function destroy(Prescription $prescription): JsonResponse
    {
        $this->authorize('delete', $prescription);
        $prescription->delete();
        return response()->json(null, 204);
    }

    public function generatePdf(Prescription $prescription)
    {
        $this->authorize('view', $prescription);
        
        $prescription->load(['patient', 'visit.doctor', 'items']);
        
        // Return HTML view that can be printed or converted to PDF by browser
        return view('prescriptions.pdf', compact('prescription'));
    }
}
