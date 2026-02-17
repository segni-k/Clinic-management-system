# Clinic Management System

A production-ready, enterprise-grade clinic management system built with Laravel 12 API, Filament v4 admin panel, and React frontend.

## 🚀 Tech Stack

- **Backend:** Laravel 12 (API only), PostgreSQL, Laravel Sanctum
- **Admin Panel:** Filament v4
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Authentication:** API tokens (Laravel Sanctum)

## 📋 Features

### Core Modules
- **Patient Management:** Complete patient registration, profiles, medical history
- **Doctor Management:** Doctor profiles, specializations, availability
- **Appointment Scheduling:** Book, manage, and track appointments
- **Visit Management:** Convert appointments to visits, record consultations
- **Prescription Management:** Create and manage prescriptions with medications
- **Invoice & Billing:** Generate invoices, track payments
- **User & Role Management:** Admin, Doctor, and Receptionist roles

### Architecture
- **Layered Backend:** Services, Repositories, Controllers separation
- **Authorization:** Policy-based access control with Laravel Policies
- **Validation:** Form Request validation on all inputs
- **API Resources:** Consistent API responses with Laravel Resources
- **Filament Admin:** Full-featured admin panel for data management

## 🏗️ Architecture

### Backend Structure (Laravel)
```
backend/app/
├── Filament/
│   └── Resources/          # Admin panel resources
│       ├── AppointmentResource.php
│       ├── DoctorResource.php
│       ├── InvoiceResource.php
│       ├── PatientResource.php
│       ├── PrescriptionResource.php
│       ├── UserResource.php
│       └── VisitResource.php
├── Http/
│   ├── Controllers/Api/    # API Controllers (business logic delegation)
│   │   ├── AppointmentController.php
│   │   ├── AuthController.php
│   │   ├── DoctorController.php
│   │   ├── InvoiceController.php
│   │   ├── PatientController.php
│   │   ├── PrescriptionController.php
│   │   └── VisitController.php
│   ├── Requests/          # Form validation
│   │   ├── LoginRequest.php
│   │   ├── StoreDoctorRequest.php
│   │   ├── StorePatientRequest.php
│   │   ├── StorePrescriptionRequest.php
│   │   └── ...
│   └── Resources/         # API response transformers
│       ├── AppointmentResource.php
│       ├── DoctorResource.php
│       └── ...
├── Models/                # Eloquent models
│   ├── Appointment.php
│   ├── Doctor.php
│   ├── Invoice.php
│   ├── Patient.php
│   ├── Prescription.php
│   ├── Visit.php
│   └── User.php
├── Policies/              # Authorization policies
│   ├── AppointmentPolicy.php
│   ├── DoctorPolicy.php
│   ├── InvoicePolicy.php
│   ├── PatientPolicy.php
│   ├── PrescriptionPolicy.php
│   └── VisitPolicy.php
├── Services/              # Business logic layer
│   ├── AppointmentService.php
│   ├── AuthService.php
│   ├── DoctorService.php
│   ├── InvoiceService.php
│   ├── PatientService.php
│   ├── PrescriptionService.php
│   └── VisitService.php
└── Repositories/          # Data access layer
    ├── AppointmentRepository.php
    ├── DoctorRepository.php
    ├── InvoiceRepository.php
    ├── PatientRepository.php
    ├── PrescriptionRepository.php
    ├── UserRepository.php
    └── VisitRepository.php
```

### Frontend Structure (React)
```
frontend/src/
├── api/
│   ├── axios.ts           # Axios configuration with auth interceptor
│   └── services.ts        # API service functions
├── components/
│   └── Layout.tsx         # Main layout component
├── context/
│   └── AuthContext.tsx    # Authentication context & hooks
└── pages/
    ├── Appointments.tsx
    ├── Dashboard.tsx
    ├── Invoices.tsx
    ├── Login.tsx
    ├── PatientForm.tsx
    ├── PatientProfile.tsx
    ├── Patients.tsx
    └── Visits.tsx
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clinic.com | password |
| Doctor | doctor@clinic.com | password |
| Receptionist | reception@clinic.com | password |

## 📡 API Endpoints

### Authentication
- `POST /api/login` - Login with email/password
- `POST /api/logout` - Logout and revoke token
- `GET /api/user` - Get authenticated user

### Patients
- `GET /api/patients` - List patients (paginated)
- `POST /api/patients` - Create patient
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient
- `GET /api/patients/search?q=` - Search patients

### Doctors
- `GET /api/doctors` - List all doctors
- `POST /api/doctors` - Create doctor
- `GET /api/doctors/{id}` - Get doctor details
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor
- `GET /api/doctors/search?q=` - Search doctors

### Appointments
- `GET /api/appointments` - List appointments (filters: date, status)
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/{id}` - Get appointment details
- `PATCH /api/appointments/{id}/status` - Update appointment status
- `DELETE /api/appointments/{id}` - Delete appointment

### Visits
- `GET /api/visits` - List visits
- `POST /api/visits` - Create visit
- `GET /api/visits/{id}` - Get visit details
- `PUT /api/visits/{id}` - Update visit
- `DELETE /api/visits/{id}` - Delete visit
- `POST /api/visits/from-appointment/{id}` - Convert appointment to visit

### Prescriptions
- `GET /api/prescriptions` - List prescriptions (filters: patient_id, visit_id, status)
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/{id}` - Get prescription details
- `PUT /api/prescriptions/{id}` - Update prescription
- `DELETE /api/prescriptions/{id}` - Delete prescription

### Invoices
- `GET /api/invoices` - List invoices (filter: payment_status)
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/{id}` - Get invoice details
- `DELETE /api/invoices/{id}` - Delete invoice
- `PATCH /api/invoices/{id}/pay` - Mark invoice as paid

## 🔐 Authorization

The system uses role-based access control:

- **Admin:** Full access to all resources
- **Doctor:** Access to own appointments, visits, and prescriptions
- **Receptionist:** Manage patients, appointments, and billing

## 🎨 Admin Panel

Access the Filament admin panel at `http://localhost:8000/admin`

Features:
- Complete CRUD for all entities
- Role-based data filtering (doctors see only their data)
- Rich form builders with relationships
- Data tables with search and filtering
- Dashboard with analytics

## 🗄️ Database Configuration

### PostgreSQL (Recommended for Production)

Update `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=clinic_management
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### Database Schema

**Core Tables:**
- `users` - System users with roles
- `roles` - User roles (admin, doctor, receptionist)
- `doctors` - Doctor profiles linked to users
- `patients` - Patient information
- `appointments` - Scheduled appointments
- `visits` - Completed patient visits
- `prescriptions` - Medical prescriptions
- `prescription_items` - Prescription medications
- `invoices` - Billing invoices
- `invoice_items` - Invoice line items

## 🧪 Testing

```bash
cd backend
php artisan test
```

## 📦 Deployment

### Backend Deployment

1. Set environment variables
2. Install dependencies: `composer install --optimize-autoloader --no-dev`
3. Generate key: `php artisan key:generate`
4. Run migrations: `php artisan migrate --force`
5. Seed database: `php artisan db:seed --force`
6. Clear & cache config: `php artisan config:cache`
7. Cache routes: `php artisan route:cache`

### Frontend Deployment

1. Set `VITE_API_URL` to your backend URL
2. Build: `npm run build`
3. Deploy `dist/` folder to your hosting

## 🛠️ Development

### Code Style
- Backend: Laravel Pint (`./vendor/bin/pint`)
- Frontend: ESLint + Prettier

### Key Technologies
- Laravel Sanctum for API authentication
- Filament v4 for admin panel
- Axios with interceptors for API calls
- React Router for navigation
- Tailwind CSS for styling

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please follow the existing architecture patterns:
- Use Services for business logic
- Use Repositories for data access
- Use Policies for authorization
- Use Form Requests for validation
- Use API Resources for responses
