<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VisitResource\Pages;
use App\Models\Visit;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class VisitResource extends Resource
{
    protected static ?string $model = Visit::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-check';

    protected static string|\UnitEnum|null $navigationGroup = 'Clinical';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('patient_id')
                ->relationship('patient', 'first_name')
                ->getOptionLabelFromRecordUsing(fn ($record) => $record->first_name . ' ' . $record->last_name)
                ->searchable()
                ->preload()
                ->required(),
            Select::make('doctor_id')
                ->relationship('doctor', 'name')
                ->searchable()
                ->preload()
                ->required(),
            Select::make('appointment_id')
                ->relationship('appointment', 'id')
                ->searchable()
                ->preload()
                ->nullable(),
            DateTimePicker::make('visit_date')->required()->default(now()),
            Textarea::make('symptoms')->rows(3),
            Textarea::make('diagnosis')->rows(3),
            Textarea::make('treatment_notes')->rows(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('patient.full_name')->label('Patient')->searchable(),
                Tables\Columns\TextColumn::make('doctor.name')->searchable(),
                Tables\Columns\TextColumn::make('visit_date')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('diagnosis')->limit(30),
                Tables\Columns\TextColumn::make('created_at')->dateTime(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('visit_date', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVisits::route('/'),
            'create' => Pages\CreateVisit::route('/create'),
            'view' => Pages\ViewVisit::route('/{record}'),
            'edit' => Pages\EditVisit::route('/{record}/edit'),
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
