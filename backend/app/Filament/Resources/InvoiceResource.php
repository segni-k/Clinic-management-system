<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InvoiceResource\Pages;
use App\Models\Invoice;
use Filament\Forms\Components\Placeholder;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class InvoiceResource extends Resource
{
    protected static ?string $model = Invoice::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-banknotes';

    protected static string|\UnitEnum|null $navigationGroup = 'Billing';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Placeholder::make('patient_id')->label('Patient')->content(fn ($record) => $record?->patient?->full_name),
            Placeholder::make('total')->content(fn ($record) => $record ? 'ETB ' . number_format($record->total, 2) : '-'),
            Placeholder::make('payment_status')->content(fn ($record) => $record?->payment_status),
            Placeholder::make('payment_method')->content(fn ($record) => $record?->payment_method ?? '-'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('patient.full_name')->label('Patient'),
                Tables\Columns\TextColumn::make('total')->money(),
                Tables\Columns\TextColumn::make('payment_status')->badge(),
                Tables\Columns\TextColumn::make('created_at')->dateTime(),
            ])
            ->filters([])
            ->actions([Tables\Actions\ViewAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInvoices::route('/'),
            'view' => Pages\ViewInvoice::route('/{record}'),
        ];
    }
}
