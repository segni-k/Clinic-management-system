# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────┐              ┌──────────────────────┐         │
│  │   React Frontend     │              │   Filament Admin     │         │
│  │   (Port 5173)        │              │   Panel              │         │
│  │                      │              │   (/admin)           │         │
│  │  - Login             │              │                      │         │
│  │  - Dashboard         │              │  - User Management   │         │
│  │  - Patients          │              │  - All Resources     │         │
│  │  - Appointments      │              │  - Reports           │         │
│  │  - Visits            │              │  - Analytics         │         │
│  │  - Invoices          │              │                      │         │
│  └──────────┬───────────┘              └──────────┬───────────┘         │
│             │                                     │                     │
│             │ HTTP/JSON                           │ Web/Session         │
│             │ Bearer Token                        │ Cookies             │
└─────────────┼─────────────────────────────────────┼─────────────────────┘
              │                                     │
              ▼                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      LARAVEL BACKEND (Port 8000)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         MIDDLEWARE LAYER                         │    │
│  │  - CORS                                                          │    │
│  │  - Laravel Sanctum Authentication (API)                         │    │
│  │  - Session Authentication (Admin)                               │    │
│  │  - Rate Limiting                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                   │                                      │
│                                   ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      ROUTING LAYER                               │    │
│  │                                                                  │    │
│  │  ┌──────────────┐              ┌──────────────┐                │    │
│  │  │  API Routes  │              │  Web Routes  │                │    │
│  │  │  (/api/*)    │              │  (/admin/*)  │                │    │
│  │  └──────┬───────┘              └──────┬───────┘                │    │
│  └─────────┼────────────────────────────┼────────────────────────┘    │
│            │                            │                              │
│            ▼                            ▼                              │
│  ┌─────────────────────┐    ┌─────────────────────┐                   │
│  │  API CONTROLLERS    │    │  FILAMENT RESOURCES │                   │
│  │  (7 Controllers)    │    │  (7 Resources)      │                   │
│  ├─────────────────────┤    ├─────────────────────┤                   │
│  │ • Auth              │    │ • Appointment       │                   │
│  │ • Patient           │    │ • Doctor            │                   │
│  │ • Doctor            │    │ • Invoice           │                   │
│  │ • Appointment       │    │ • Patient           │                   │
│  │ • Visit             │    │ • Prescription      │                   │
│  │ • Prescription      │    │ • User              │                   │
│  │ • Invoice           │    │ • Visit             │                   │
│  └─────────┬───────────┘    └─────────────────────┘                   │
│            │                                                            │
│            │ Delegates to                                              │
│            ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    AUTHORIZATION LAYER                           │  │
│  │                       (Policies)                                 │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │ AppointmentPolicy • DoctorPolicy • InvoicePolicy         │   │  │
│  │  │ PatientPolicy • PrescriptionPolicy • VisitPolicy         │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│            │                                                            │
│            ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     VALIDATION LAYER                             │  │
│  │                    (Form Requests)                               │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │ StorePatientRequest • UpdatePatientRequest               │   │  │
│  │  │ StoreAppointmentRequest • StorePrescriptionRequest       │   │  │
│  │  │ [13 Form Request Validators Total]                       │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│            │                                                            │
│            ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    BUSINESS LOGIC LAYER                          │  │
│  │                       (Services)                                 │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │ AppointmentService • AuthService • DoctorService         │   │  │
│  │  │ InvoiceService • PatientService                          │   │  │
│  │  │ PrescriptionService • VisitService                       │   │  │
│  │  └───────────────────────┬──────────────────────────────────┘   │  │
│  └────────────────────────────┼───────────────────────────────────┘  │
│                               │                                        │
│                               │ Uses                                   │
│                               ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    DATA ACCESS LAYER                             │  │
│  │                     (Repositories)                               │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │ AppointmentRepository • DoctorRepository                 │   │  │
│  │  │ InvoiceRepository • PatientRepository                    │   │  │
│  │  │ PrescriptionRepository • UserRepository                  │   │  │
│  │  │ VisitRepository                                          │   │  │
│  │  └───────────────────────┬──────────────────────────────────┘   │  │
│  └────────────────────────────┼───────────────────────────────────┘  │
│                               │                                        │
│                               │ Queries                                │
│                               ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                      ELOQUENT ORM LAYER                          │  │
│  │                        (Models)                                  │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │ User • Role • Doctor • Patient • Appointment             │   │  │
│  │  │ Visit • Prescription • PrescriptionItem                  │   │  │
│  │  │ Invoice • InvoiceItem                                    │   │  │
│  │  └───────────────────────┬──────────────────────────────────┘   │  │
│  └────────────────────────────┼───────────────────────────────────┘  │
│                               │                                        │
│                               │ SQL/ORM                                │
│                               ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                   RESPONSE FORMATTING LAYER                      │  │
│  │                     (API Resources)                              │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │ AppointmentResource • DoctorResource                     │   │  │
│  │  │ PatientResource • PrescriptionResource                   │   │  │
│  │  │ [10 API Resources Total]                                 │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ SQL Queries
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────┐                                               │
│  │   PostgreSQL DB      │                                               │
│  │                      │                                               │
│  │  Tables:             │                                               │
│  │  • users             │                                               │
│  │  • roles             │                                               │
│  │  • doctors           │                                               │
│  │  • patients          │                                               │
│  │  • appointments      │                                               │
│  │  • visits            │                                               │
│  │  • prescriptions     │                                               │
│  │  • prescription_items│                                               │
│  │  • invoices          │                                               │
│  │  • invoice_items     │                                               │
│  │  • personal_access_  │                                               │
│  │    tokens (Sanctum)  │                                               │
│  └──────────────────────┘                                               │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                            SECURITY FLOW
═══════════════════════════════════════════════════════════════════════════

┌────────────────┐
│ User Request   │
└───────┬────────┘
        │
        ▼
┌─────────────────────────────────┐
│ 1. CORS Check                   │
│    ✓ Allow Origin              │
└───────┬─────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ 2. Authentication               │
│    ✓ Sanctum Token (API)       │
│    ✓ Session Cookie (Admin)    │
└───────┬─────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ 3. Authorization (Policy)       │
│    ✓ Check user permissions    │
│    ✓ Role-based access          │
└───────┬─────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ 4. Validation (Form Request)    │
│    ✓ Input validation           │
│    ✓ Business rules             │
└───────┬─────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ 5. Process Request              │
│    ✓ Service layer logic        │
│    ✓ Repository data access     │
└───────┬─────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ 6. Format Response              │
│    ✓ API Resource transform     │
└───────┬─────────────────────────┘
        │
        ▼
┌────────────────┐
│ JSON Response  │
└────────────────┘


═══════════════════════════════════════════════════════════════════════════
                         DATA FLOW EXAMPLE
                    (Creating an Appointment)
═══════════════════════════════════════════════════════════════════════════

React Frontend
    │
    │ POST /api/appointments
    │ {patient_id: 1, doctor_id: 2, date: "2024-01-20", timeslot: "09:00"}
    ▼
AppointmentController
    │
    │ authorize('create', Appointment::class)
    │ StoreAppointmentRequest validates input
    ▼
AppointmentService
    │
    │ Check slot availability (business logic)
    │ appointmentRepository->isSlotBooked(...)
    │ Create appointment record
    ▼
AppointmentRepository
    │
    │ Appointment::create([...])
    ▼
Eloquent Model (Appointment)
    │
    │ SQL INSERT INTO appointments ...
    ▼
PostgreSQL Database
    │
    │ Returns created record
    ▼
AppointmentResource
    │
    │ Transform to API format
    │ Include relationships (patient, doctor)
    ▼
JSON Response
    │
    │ 201 Created
    │ {id: 5, patient: {...}, doctor: {...}, status: "scheduled"}
    ▼
React Frontend
    │
    │ Update UI with new appointment


═══════════════════════════════════════════════════════════════════════════
                         TECHNOLOGY STACK
═══════════════════════════════════════════════════════════════════════════

Frontend:
  ✓ React 18
  ✓ TypeScript
  ✓ Vite
  ✓ Tailwind CSS
  ✓ Axios (with interceptors)
  ✓ React Router

Backend:
  ✓ Laravel 12
  ✓ PHP 8.2+
  ✓ Filament v4
  ✓ Laravel Sanctum 4.3

Database:
  ✓ PostgreSQL

Architecture:
  ✓ RESTful API
  ✓ Layered Architecture
  ✓ Repository Pattern
  ✓ Service Layer Pattern
  ✓ Policy-based Authorization
  ✓ Token-based Authentication


═══════════════════════════════════════════════════════════════════════════
                         FILE COUNT SUMMARY
═══════════════════════════════════════════════════════════════════════════

Controllers:         8 files
Services:            7 files
Repositories:        7 files
Models:             10 files
Policies:            6 files
Form Requests:      13 files
API Resources:      10 files
Filament Resources:  7 files (+ 25 page classes)
Frontend Pages:      8 files

Total Backend PHP:  93 files
Total Frontend:     10+ files
Documentation:       5 files

═══════════════════════════════════════════════════════════════════════════
```
