<?php

namespace App\Filament\Widgets;

use App\Models\Appointment;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TodayAppointmentsWidget extends BaseWidget
{
    protected static ?int $sort = 2;
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        $user = auth()->user();
        $query = Appointment::with(['patient', 'doctor'])
            ->whereDate('appointment_date', today())
            ->where('status', 'scheduled');

        // Filter by doctor role
        if ($user?->isDoctor() && $user->doctor) {
            $query->where('doctor_id', $user->doctor->id);
        }

        return $table
            ->query($query)
            ->columns([
                Tables\Columns\TextColumn::make('patient.full_name')
                    ->label('Patient')
                    ->searchable()
                    ->weight('medium')
                    ->icon('heroicon-m-user')
                    ->color('primary'),
                Tables\Columns\TextColumn::make('doctor.name')
                    ->label('Doctor')
                    ->hidden(fn () => auth()->user()?->isDoctor()),
                Tables\Columns\TextColumn::make('timeslot')
                    ->label('Time')
                    ->badge()
                    ->color('success')
                    ->icon('heroicon-m-clock'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'scheduled' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        'no_show' => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('notes')
                    ->limit(40)
                    ->tooltip(fn ($record) => $record->notes),
            ])
            ->heading('Today\'s Appointments')
            ->description('Scheduled appointments for today')
            ->emptyStateHeading('No appointments today')
            ->emptyStateDescription('There are no scheduled appointments for today.')
            ->emptyStateIcon('heroicon-o-calendar');
    }
}
