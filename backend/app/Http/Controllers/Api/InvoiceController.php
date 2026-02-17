<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PayInvoiceRequest;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(
        protected InvoiceService $invoiceService
    ) {}

    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $this->authorize('viewAny', Invoice::class);

        $query = Invoice::with(['patient', 'visit']);

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->get('payment_status'));
        }

        $invoices = $query->latest()->paginate($request->get('per_page', 15));

        return InvoiceResource::collection($invoices);
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $invoice = $this->invoiceService->create($request->validated(), $request->user()->id);
        return response()->json(new InvoiceResource($invoice->load(['patient', 'visit', 'items'])), 201);
    }

    public function show(Invoice $invoice): InvoiceResource
    {
        $this->authorize('view', $invoice);
        $invoice->load(['patient', 'visit', 'items']);
        return new InvoiceResource($invoice);
    }

    public function pay(PayInvoiceRequest $request, Invoice $invoice): InvoiceResource
    {
        $invoice = $this->invoiceService->pay($invoice, $request->validated('payment_method'));
        return new InvoiceResource($invoice->load(['patient', 'items']));
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        $this->authorize('delete', $invoice);
        $invoice->delete();
        return response()->json(null, 204);
    }

    public function generatePdf(Invoice $invoice)
    {
        $this->authorize('view', $invoice);
        
        $invoice->load(['patient', 'visit', 'items']);
        
        // Return HTML view that can be printed or converted to PDF by browser
        return view('invoices.pdf', compact('invoice'));
    }
}
