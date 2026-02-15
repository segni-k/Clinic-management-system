<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AppointmentResource\Pages;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class AppointmentResource extends Resource
{
    protected static ?string $model = Appointment::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';

    protected static string|\UnitEnum|null $navigationGroup = 'Scheduling';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('patient_id')->relationship('patient', 'first_name')->getOptionLabelFromRecordUsing(fn ($record) => $record->first_name . ' ' . $record->last_name)->searchable()->preload()->required(),
            Select::make('doctor_id')->relationship('doctor', 'name')->searchable()->preload()->required(),
            DatePicker::make('appointment_date')->required(),
            TextInput::make('timeslot')->required()->maxLength(10),
            Select::make('status')->options([
                'scheduled' => 'Scheduled',
                'completed' => 'Completed',
                'cancelled' => 'Cancelled',
                'no_show' => 'No Show',
            ])->default('scheduled'),
            Textarea::make('notes')->rows(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('patient.full_name')->label('Patient')->searchable(),
                Tables\Columns\TextColumn::make('doctor.name'),
                Tables\Columns\TextColumn::make('appointment_date')->date(),
                Tables\Columns\TextColumn::make('timeslot'),
                Tables\Columns\TextColumn::make('status')->badge(),
            ])
            ->filters([])
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAppointments::route('/'),
            'create' => Pages\CreateAppointment::route('/create'),
            'edit' => Pages\EditAppointment::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        $query = parent::getEloquentQuery();
        if (auth()->user()?->isDoctor() && auth()->user()?->doctor) {
            $query->where('doctor_id', auth()->user()->doctor->id);
        }
        return $query;
    }
}
