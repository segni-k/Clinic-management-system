<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescription</title>
    <style>
        @page {
            margin: 20px;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .prescription-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            border: 2px solid #10b981;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #10b981;
            padding-bottom: 15px;
        }
        .clinic-name {
            font-size: 26px;
            font-weight: bold;
            color: #10b981;
            margin: 0;
        }
        .clinic-info {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }
        .rx-symbol {
            font-size: 48px;
            font-weight: bold;
            color: #10b981;
            margin: 20px 0;
            font-family: 'Times New Roman', serif;
        }
        .patient-section {
            margin-bottom: 25px;
            padding: 15px;
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #065f46;
            margin-bottom: 10px;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
            color: #555;
        }
        .info-value {
            flex: 1;
        }
        .prescription-details {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            background-color: #fafafa;
        }
        .medication-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
        }
        .medication-item:last-child {
            border-bottom: none;
        }
        .medication-name {
            font-size: 18px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 10px;
        }
        .medication-details {
            margin-left: 20px;
        }
        .detail-row {
            margin: 5px 0;
        }
        .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 120px;
        }
        .instructions {
            margin-top: 20px;
            padding: 15px;
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            font-style: italic;
        }
        .doctor-signature {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .signature-line {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            text-align: center;
        }
        .signature-box-line {
            border-top: 2px solid #333;
            width: 250px;
            margin-bottom: 5px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="prescription-container">
        <!-- Header -->
        <div class="header">
            <h1 class="clinic-name">HealthCare Clinic</h1>
            <p class="clinic-info">
                123 Medical Street, Healthcare City<br>
                Phone: +1 (555) 123-4567 | Email: info@healthcareclinic.com<br>
                License #: MC-2024-123456
            </p>
        </div>

        <!-- Rx Symbol -->
        <div class="rx-symbol">℞</div>

        <!-- Patient Information -->
        <div class="patient-section">
            <div class="section-title">Patient Information</div>
            <div class="info-row">
                <span class="info-label">Patient Name:</span>
                <span class="info-value">{{ $prescription->patient->full_name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Age/Gender:</span>
                <span class="info-value">
                    @if($prescription->patient->date_of_birth)
                        {{ \Carbon\Carbon::parse($prescription->patient->date_of_birth)->age }} years old
                    @endif
                    @if($prescription->patient->gender)
                        / {{ ucfirst($prescription->patient->gender) }}
                    @endif
                </span>
            </div>
            @if($prescription->patient->phone)
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">{{ $prescription->patient->phone }}</span>
                </div>
            @endif
            <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($prescription->created_at)->format('M d, Y') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Prescription ID:</span>
                <span class="info-value">#{{ $prescription->id }}</span>
            </div>
        </div>

        <!-- Visit Information -->
        @if($prescription->visit)
            <div class="info-row" style="margin-bottom: 15px;">
                <span class="info-label">Diagnosis:</span>
                <span class="info-value"><strong>{{ $prescription->visit->diagnosis }}</strong></span>
            </div>
        @endif

        <!-- Prescription Details -->
        <div class="prescription-details">
            <div class="section-title">Prescription</div>
            
            @if($prescription->items && $prescription->items->count() > 0)
                @foreach($prescription->items as $item)
                    <div class="medication-item">
                        <div class="medication-name">{{ $item->medication }}</div>
                        <div class="medication-details">
                            <div class="detail-row">
                                <span class="detail-label">Dosage:</span>
                                <span>{{ $item->dosage }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Frequency:</span>
                                <span>{{ $item->frequency }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Duration:</span>
                                <span>{{ $item->duration }}</span>
                            </div>
                            @if($item->instructions)
                                <div class="detail-row">
                                    <span class="detail-label">Instructions:</span>
                                    <span>{{ $item->instructions }}</span>
                                </div>
                            @endif
                        </div>
                    </div>
                @endforeach
            @else
                <div class="medication-item">
                    <div class="medication-name">{{ $prescription->medication }}</div>
                    <div class="medication-details">
                        <div class="detail-row">
                            <span class="detail-label">Dosage:</span>
                            <span>{{ $prescription->dosage }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Frequency:</span>
                            <span>{{ $prescription->frequency }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Duration:</span>
                            <span>{{ $prescription->duration }}</span>
                        </div>
                        @if($prescription->instructions)
                            <div class="detail-row">
                                <span class="detail-label">Instructions:</span>
                                <span>{{ $prescription->instructions }}</span>
                            </div>
                        @endif
                    </div>
                </div>
            @endif

            @if($prescription->instructions)
                <div class="instructions">
                    <strong>Special Instructions:</strong><br>
                    {{ $prescription->instructions }}
                </div>
            @endif
        </div>

        <!-- Doctor Signature -->
        <div class="doctor-signature">
            <div class="signature-line">
                <div class="signature-box">
                    <div class="signature-box-line"></div>
                    <div>Doctor's Signature</div>
                    @if($prescription->visit && $prescription->visit->doctor)
                        <div style="font-weight: bold; margin-top: 5px;">
                            Dr. {{ $prescription->visit->doctor->name }}
                        </div>
                        @if($prescription->visit->doctor->specialization)
                            <div style="font-size: 12px; color: #666;">
                                {{ $prescription->visit->doctor->specialization }}
                            </div>
                        @endif
                    @endif
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Important:</strong> This prescription is valid for {{ $prescription->duration ?? '30 days' }} from the date of issue.</p>
            <p>Please complete the full course of medication as prescribed. Do not share this medication with others.</p>
            <p>For any queries, contact our pharmacy at pharmacy@healthcareclinic.com</p>
        </div>
    </div>

    <script>
        // Auto-print on load (optional)
        // window.onload = function() { window.print(); }
    </script>
</body>
</html>
