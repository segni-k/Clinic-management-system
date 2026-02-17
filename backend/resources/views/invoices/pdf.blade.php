<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $invoice->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #ddd;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
        }
        .clinic-name {
            font-size: 28px;
            font-weight: bold;
            color: #10b981;
            margin: 0;
        }
        .clinic-info {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0 10px;
        }
        .details-section {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .details-column {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .details-label {
            font-weight: bold;
            color: #555;
        }
        .details-value {
            margin-bottom: 8px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #10b981;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #0ea57a;
        }
        .items-table td {
            padding: 12px;
            border: 1px solid #ddd;
        }
        .items-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .totals-section {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .totals-row.grand-total {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #10b981;
            border-bottom: 2px solid #10b981;
            padding: 12px 0;
            margin-top: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
        }
        .status-paid {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-unpaid {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .footer {
            clear: both;
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .text-right {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <h1 class="clinic-name">HealthCare Clinic</h1>
            <p class="clinic-info">
                123 Medical Street, Healthcare City<br>
                Phone: +1 (555) 123-4567 | Email: info@healthcareclinic.com
            </p>
        </div>

        <!-- Invoice Title and Number -->
        <div class="invoice-title">INVOICE</div>
        <p><strong>Invoice #:</strong> {{ $invoice->id }}</p>

        <!-- Details Section -->
        <div class="details-section">
            <div class="details-column">
                <p class="details-label">Bill To:</p>
                <p class="details-value">
                    <strong>{{ $invoice->patient->full_name }}</strong><br>
                    @if($invoice->patient->phone)
                        Phone: {{ $invoice->patient->phone }}<br>
                    @endif
                    @if($invoice->patient->email)
                        Email: {{ $invoice->patient->email }}<br>
                    @endif
                    @if($invoice->patient->address)
                        {{ $invoice->patient->address }}
                    @endif
                </p>
            </div>
            <div class="details-column">
                <p class="details-value">
                    <span class="details-label">Issue Date:</span> {{ \Carbon\Carbon::parse($invoice->issue_date)->format('M d, Y') }}
                </p>
                <p class="details-value">
                    <span class="details-label">Due Date:</span> {{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}
                </p>
                <p class="details-value">
                    <span class="details-label">Status:</span>
                    <span class="status-badge status-{{ $invoice->payment_status }}">
                        {{ ucfirst($invoice->payment_status) }}
                    </span>
                </p>
                @if($invoice->visit)
                    <p class="details-value">
                        <span class="details-label">Visit Date:</span> {{ \Carbon\Carbon::parse($invoice->visit->visit_date)->format('M d, Y') }}
                    </p>
                @endif
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 60%;">Description</th>
                    <th style="width: 20%;" class="text-right">Unit Price</th>
                    <th style="width: 10%;" class="text-right">Qty</th>
                    <th style="width: 20%;" class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @if($invoice->items && $invoice->items->count() > 0)
                    @foreach($invoice->items as $item)
                        <tr>
                            <td>{{ $item->description }}</td>
                            <td class="text-right">{{ number_format($item->unit_price, 2) }} ETB</td>
                            <td class="text-right">{{ $item->quantity }}</td>
                            <td class="text-right">{{ number_format($item->unit_price * $item->quantity, 2) }} ETB</td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td>Medical Consultation</td>
                        <td class="text-right">{{ number_format($invoice->total, 2) }} ETB</td>
                        <td class="text-right">1</td>
                        <td class="text-right">{{ number_format($invoice->total, 2) }} ETB</td>
                    </tr>
                @endif
            </tbody>
        </table>

        <!-- Totals Section -->
        <div class="totals-section">
            <div class="totals-row">
                <span>Subtotal:</span>
                <span>{{ number_format($invoice->total, 2) }} ETB</span>
            </div>
            <div class="totals-row">
                <span>Tax (0%):</span>
                <span>0.00 ETB</span>
            </div>
            <div class="totals-row grand-total">
                <span>Total Amount:</span>
                <span>{{ number_format($invoice->total, 2) }} ETB</span>
            </div>
            @if($invoice->payment_status === 'paid' && $invoice->payment_method)
                <div class="totals-row">
                    <span>Payment Method:</span>
                    <span>{{ ucfirst($invoice->payment_method) }}</span>
                </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Thank you for choosing HealthCare Clinic!</strong></p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p>For any queries, please contact us at billing@healthcareclinic.com</p>
        </div>
    </div>
</body>
</html>
