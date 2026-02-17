<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVisitRequest;
use App\Http\Requests\UpdateVisitRequest;
use App\Http\Resources\VisitResource;
use App\Models\Appointment;
use App\Models\Visit;
use App\Services\VisitService;
use Illuminate\Http\JsonResponse;

class VisitController extends Controller
{
    public function __construct(
        protected VisitService $visitService
    ) {}

    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $this->authorize('viewAny', Visit::class);

        $query = Visit::with(['patient', 'doctor', 'appointment']);

        if (request()->user()->isDoctor() && request()->user()->doctor) {
            $query->where('doctor_id', request()->user()->doctor->id);
        }

        $visits = $query->latest('visit_date')->paginate(request()->get('per_page', 15));

        return VisitResource::collection($visits);
    }

    public function fromAppointment(Appointment $appointment): JsonResponse
    {
        $this->authorize('create', Visit::class);
        $this->authorize('view', $appointment);

        if ($appointment->status !== Appointment::STATUS_SCHEDULED) {
            return response()->json(['message' => 'Appointment must be scheduled to convert to visit.'], 422);
        }

        if ($appointment->visit) {
            return response()->json(new VisitResource($appointment->visit->load(['patient', 'doctor', 'prescriptions.items'])), 200);
        }

        $visit = $this->visitService->createFromAppointment($appointment, request()->user()->id);
        return response()->json(new VisitResource($visit->load(['patient', 'doctor', 'prescriptions.items'])), 201);
    }

    public function store(StoreVisitRequest $request): JsonResponse
    {
        $visit = $this->visitService->create($request->validated(), $request->user()->id);
        return response()->json(new VisitResource($visit->load(['patient', 'doctor'])), 201);
    }

    public function show(Visit $visit): VisitResource
    {
        $this->authorize('view', $visit);
        $visit->load(['patient', 'doctor', 'appointment', 'prescriptions.items', 'invoice.items']);
        return new VisitResource($visit);
    }

    public function update(UpdateVisitRequest $request, Visit $visit): VisitResource
    {
        $visit = $this->visitService->update($visit, $request->validated());
        return new VisitResource($visit->load(['patient', 'doctor', 'prescriptions.items']));
    }

    public function destroy(Visit $visit): JsonResponse
    {
        $this->authorize('delete', $visit);
        $visit->delete();
        return response()->json(null, 204);
    }
}
