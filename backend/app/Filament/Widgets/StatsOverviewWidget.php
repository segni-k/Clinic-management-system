<?php

namespace App\Filament\Widgets;

use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\Patient;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $user = auth()->user();
        $doctorId = $user?->isDoctor() ? $user->doctor?->id : null;

        $appointmentsQuery = Appointment::whereDate('appointment_date', today())->where('status', 'scheduled');
        if ($doctorId) {
            $appointmentsQuery->where('doctor_id', $doctorId);
        }

        $revenueQuery = Invoice::where('payment_status', 'paid')->whereMonth('created_at', now()->month);
        $pendingQuery = Invoice::where('payment_status', 'unpaid');

        return [
            Stat::make('Today\'s Appointments', $appointmentsQuery->count()),
            Stat::make('Total Patients', Patient::count()),
            Stat::make('Revenue This Month', 'ETB ' . number_format($revenueQuery->sum('total'), 2)),
            Stat::make('Pending Invoices', $pendingQuery->count()),
        ];
    }
}
