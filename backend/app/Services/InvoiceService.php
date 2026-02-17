<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Visit;
use App\Repositories\InvoiceRepository;

class InvoiceService
{
    public function __construct(
        protected InvoiceRepository $repository
    ) {}
    public function create(array $data, ?int $createdBy = null): Invoice
    {
        $visit = Visit::findOrFail($data['visit_id']);

        $invoice = Invoice::create([
            'visit_id' => $visit->id,
            'patient_id' => $visit->patient_id,
            'subtotal' => 0,
            'discount' => $data['discount'] ?? 0,
            'total' => 0,
            'payment_status' => Invoice::PAYMENT_STATUS_UNPAID,
            'payment_method' => $data['payment_method'] ?? null,
            'created_by' => $createdBy,
        ]);

        $subtotal = 0;
        foreach ($data['items'] as $item) {
            $amount = $item['quantity'] * $item['unit_price'];
            $subtotal += $amount;
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'amount' => $amount,
            ]);
        }

        $invoice->update([
            'subtotal' => $subtotal,
            'total' => $subtotal - ($invoice->discount ?? 0),
        ]);

        return $invoice->fresh(['items']);
    }

    public function pay(Invoice $invoice, string $paymentMethod): Invoice
    {
        $invoice->update([
            'payment_status' => Invoice::PAYMENT_STATUS_PAID,
            'payment_method' => $paymentMethod,
            'paid_at' => now(),
        ]);
        return $invoice->fresh();
    }
}
