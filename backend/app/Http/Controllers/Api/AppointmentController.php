<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        protected AppointmentService $appointmentService
    ) {}

    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $this->authorize('viewAny', Appointment::class);

        $query = Appointment::with(['patient', 'doctor']);

        if ($request->user()->isDoctor() && $request->user()->doctor) {
            $query->where('doctor_id', $request->user()->doctor->id);
        }

        if ($request->has('date')) {
            $query->whereDate('appointment_date', $request->get('date'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $appointments = $query->latest('appointment_date')->latest()->paginate($request->get('per_page', 15));

        return AppointmentResource::collection($appointments);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $appointment = $this->appointmentService->create($request->validated(), $request->user()->id);
        return response()->json(new AppointmentResource($appointment->load(['patient', 'doctor'])), 201);
    }

    public function show(Appointment $appointment): AppointmentResource
    {
        $this->authorize('view', $appointment);
        $appointment->load(['patient', 'doctor', 'visit']);
        return new AppointmentResource($appointment);
    }

    public function updateStatus(UpdateAppointmentStatusRequest $request, Appointment $appointment): AppointmentResource
    {
        $appointment = $this->appointmentService->updateStatus($appointment, $request->validated('status'));
        return new AppointmentResource($appointment->load(['patient', 'doctor']));
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $this->authorize('delete', $appointment);
        $appointment->delete();
        return response()->json(null, 204);
    }
}
