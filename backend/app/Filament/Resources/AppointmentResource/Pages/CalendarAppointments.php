<?php

namespace App\Filament\Resources\AppointmentResource\Pages;

use App\Filament\Resources\AppointmentResource;
use App\Models\Appointment;
use Filament\Actions;
use Filament\Resources\Pages\Page;
use Illuminate\Contracts\Support\Htmlable;

class CalendarAppointments extends Page
{
    protected static string $resource = AppointmentResource::class;

    protected static string $view = 'filament.resources.appointment-resource.pages.calendar-appointments';

    protected static ?string $title = 'Appointment Calendar';

    public function getTitle(): string | Htmlable
    {
        return 'Appointment Calendar';
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('list')
                ->label('List View')
                ->icon('heroicon-o-list-bullet')
                ->url(fn (): string => static::getResource()::getUrl('index'))
                ->color('gray'),
        ];
    }

    public function getViewData(): array
    {
        $user = auth()->user();
        $query = Appointment::with(['patient', 'doctor']);

        // Filter by doctor role
        if ($user?->isDoctor() && $user->doctor) {
            $query->where('doctor_id', $user->doctor->id);
        }

        $appointments = $query->get()->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'title' => $appointment->patient->full_name . ' - ' . $appointment->timeslot,
                'start' => $appointment->appointment_date->format('Y-m-d'),
                'backgroundColor' => match($appointment->status) {
                    'scheduled' => '#3b82f6',
                    'completed' => '#10b981',
                    'cancelled' => '#ef4444',
                    'no_show' => '#f59e0b',
                    default => '#6b7280',
                },
                'borderColor' => match($appointment->status) {
                    'scheduled' => '#2563eb',
                    'completed' => '#059669',
                    'cancelled' => '#dc2626',
                    'no_show' => '#d97706',
                    default => '#4b5563',
                },
                'extendedProps' => [
                    'patient' => $appointment->patient->full_name,
                    'doctor' => $appointment->doctor->name,
                    'status' => $appointment->status,
                    'timeslot' => $appointment->timeslot,
                    'notes' => $appointment->notes,
                ],
            ];
        });

        return [
            'appointments' => $appointments,
        ];
    }
}
