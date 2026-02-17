<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PrescriptionResource\Pages;
use App\Models\Prescription;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class PrescriptionResource extends Resource
{
    protected static ?string $model = Prescription::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-text';

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
            Select::make('visit_id')
                ->relationship('visit', 'id')
                ->searchable()
                ->preload()
                ->nullable(),
            Textarea::make('diagnosis')->rows(3),
            Textarea::make('notes')->rows(3),
            Select::make('status')
                ->options([
                    'active' => 'Active',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                ])
                ->default('active'),
            Repeater::make('items')
                ->relationship()
                ->schema([
                    TextInput::make('medication')->required()->maxLength(255),
                    TextInput::make('dosage')->required()->maxLength(255),
                    TextInput::make('frequency')->required()->maxLength(255),
                    TextInput::make('duration')->required()->maxLength(255),
                    Textarea::make('instructions')->rows(2),
                ])
                ->columns(2)
                ->defaultItems(1)
                ->collapsible(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('patient.full_name')->label('Patient')->searchable(),
                Tables\Columns\TextColumn::make('doctor.name')->searchable(),
                Tables\Columns\TextColumn::make('diagnosis')->limit(30),
                Tables\Columns\TextColumn::make('status')->badge(),
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
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPrescriptions::route('/'),
            'create' => Pages\CreatePrescription::route('/create'),
            'view' => Pages\ViewPrescription::route('/{record}'),
            'edit' => Pages\EditPrescription::route('/{record}/edit'),
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
