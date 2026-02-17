<?php

namespace App\Providers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Prescription;
use App\Models\Visit;
use App\Policies\AppointmentPolicy;
use App\Policies\DoctorPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\PatientPolicy;
use App\Policies\PrescriptionPolicy;
use App\Policies\VisitPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Appointment::class => AppointmentPolicy::class,
        Doctor::class => DoctorPolicy::class,
        Invoice::class => InvoicePolicy::class,
        Patient::class => PatientPolicy::class,
        Prescription::class => PrescriptionPolicy::class,
        Visit::class => VisitPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
