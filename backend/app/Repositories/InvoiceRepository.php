<?php

namespace App\Repositories;

use App\Models\Invoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class InvoiceRepository
{
    public function paginate(int $perPage = 15, ?string $paymentStatus = null): LengthAwarePaginator
    {
        $query = Invoice::with(['patient', 'visit'])
            ->latest();

        if ($paymentStatus) {
            $query->where('payment_status', $paymentStatus);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Invoice
    {
        return Invoice::find($id);
    }

    public function findWithRelations(int $id, array $relations = []): ?Invoice
    {
        return Invoice::with($relations)->find($id);
    }

    public function findByVisitId(int $visitId): ?Invoice
    {
        return Invoice::where('visit_id', $visitId)->first();
    }

    public function getUnpaidInvoices(): Collection
    {
        return Invoice::with(['patient', 'visit'])
            ->where('payment_status', Invoice::PAYMENT_STATUS_UNPAID)
            ->latest()
            ->get();
    }

    public function getTotalRevenue(?string $startDate = null, ?string $endDate = null): float
    {
        $query = Invoice::where('payment_status', Invoice::PAYMENT_STATUS_PAID);

        if ($startDate) {
            $query->where('paid_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('paid_at', '<=', $endDate);
        }

        return $query->sum('total');
    }
}
