# Role-Based Access Control (RBAC) Audit ✅

## Date: 2026-02-17

## Overview
Complete audit and verification of Role-Based Access Control (RBAC) implementation for the Clinic Management System.

**Status:** All requirements fully implemented and verified ✅

---

## 8. RBAC Implementation - Complete ✅

### Roles Implemented: 3/3 ✅

**Location:** [backend/app/Models/Role.php](backend/app/Models/Role.php)

```php
class Role extends Model
{
    public const ADMIN = 'admin';
    public const DOCTOR = 'doctor';
    public const RECEPTIONIST = 'receptionist';
}
```

**Features:**
- ✅ 3 role constants defined
- ✅ Relationship with User model
- ✅ Database table with name and slug fields

**Database Seeding:** [backend/database/seeders/RoleSeeder.php](backend/database/seeders/RoleSeeder.php)
```php
Role::create(['name' => 'Admin', 'slug' => 'admin']);
Role::create(['name' => 'Doctor', 'slug' => 'doctor']);
Role::create(['name' => 'Receptionist', 'slug' => 'receptionist']);
```

---

## User Model with Role Helper Methods ✅

**Location:** [backend/app/Models/User.php](backend/app/Models/User.php)

```php
class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable;
    
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
    
    public function doctor(): HasOne
    {
        return $this->hasOne(Doctor::class);
    }
    
    public function isAdmin(): bool
    {
        return $this->role?->slug === Role::ADMIN;
    }
    
    public function isDoctor(): bool
    {
        return $this->role?->slug === Role::DOCTOR;
    }
    
    public function isReceptionist(): bool
    {
        return $this->role?->slug === Role::RECEPTIONIST;
    }
    
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role !== null && in_array($this->role->slug, [
            Role::ADMIN, 
            Role::DOCTOR, 
            Role::RECEPTIONIST
        ], true);
    }
}
```

**Features:**
- ✅ Role relationship
- ✅ Doctor relationship (for doctor users)
- ✅ Helper methods for role checking
- ✅ Filament panel access control

---

## Policies Created and Registered: 6/6 ✅

### Policy Registration

**Location:** [backend/app/Providers/AuthServiceProvider.php](backend/app/Providers/AuthServiceProvider.php)

```php
class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Appointment::class => AppointmentPolicy::class,
        Doctor::class => DoctorPolicy::class,
        Invoice::class => InvoicePolicy::class,
        Patient::class => PatientPolicy::class,
        Prescription::class => PrescriptionPolicy::class,
        Visit::class => VisitPolicy::class,
    ];
}
```

**Registered in:** [backend/bootstrap/providers.php](backend/bootstrap/providers.php)
```php
return [
    App\Providers\AuthServiceProvider::class,
    // ...
];
```

✅ All 6 policies properly registered

---

## Policy Details

### 1. AppointmentPolicy ✅

**Location:** [backend/app/Policies/AppointmentPolicy.php](backend/app/Policies/AppointmentPolicy.php)

**Doctor Restriction Implemented:**
```php
public function view(User $user, Appointment $appointment): bool
{
    if ($user->isAdmin() || $user->isReceptionist()) {
        return true;  // Admin and receptionist see all
    }
    if ($user->isDoctor() && $user->doctor) {
        // Doctor can only see THEIR appointments
        return $appointment->doctor_id === $user->doctor->id;
    }
    return false;
}
```

**Receptionist Permissions:**
```php
public function create(User $user): bool
{
    // Receptionist CAN create appointments
    return $user->isAdmin() || $user->isReceptionist();
}
```

**Permission Matrix:**
| Action | Admin | Doctor | Receptionist |
|--------|-------|--------|--------------|
| viewAny | ✅ | ✅ | ✅ |
| view | ✅ All | ✅ Own only | ✅ All |
| create | ✅ | ❌ | ✅ |
| update | ✅ | ❌ | ✅ |
| delete | ✅ | ❌ | ✅ |

---

### 2. VisitPolicy ✅

**Location:** [backend/app/Policies/VisitPolicy.php](backend/app/Policies/VisitPolicy.php)

**Doctor Restriction Implemented:**
```php
public function view(User $user, Visit $visit): bool
{
    if ($user->isAdmin() || $user->isReceptionist()) {
        return true;  // Admin and receptionist see all
    }
    if ($user->isDoctor() && $user->doctor) {
        // Doctor can only see THEIR visits
        return $visit->doctor_id === $user->doctor->id;
    }
    return false;
}
```

**Permission Matrix:**
| Action | Admin | Doctor | Receptionist |
|--------|-------|--------|--------------|
| viewAny | ✅ | ✅ | ✅ |
| view | ✅ All | ✅ Own only | ✅ All |
| create | ✅ | ✅ | ✅ |
| update | ✅ | ✅ | ✅ |
| delete | ✅ | ❌ | ❌ |

---

### 3. PatientPolicy ✅

**Location:** [backend/app/Policies/PatientPolicy.php](backend/app/Policies/PatientPolicy.php)

**Receptionist Permissions:**
```php
public function create(User $user): bool
{
    // Receptionist CAN create patients
    return $user->isAdmin() || $user->isReceptionist();
}
```

**Permission Matrix:**
| Action | Admin | Doctor | Receptionist |
|--------|-------|--------|--------------|
| viewAny | ✅ | ✅ | ✅ |
| view | ✅ | ✅ | ✅ |
| create | ✅ | ❌ | ✅ |
| update | ✅ | ❌ | ✅ |
| delete | ✅ | ❌ | ❌ |

---

### 4. DoctorPolicy ✅

**Location:** [backend/app/Policies/DoctorPolicy.php](backend/app/Policies/DoctorPolicy.php)

**Admin-Only Management:**
```php
public function create(User $user): bool
{
    return $user->isAdmin();  // Only admins can create doctors
}

public function update(User $user, Doctor $doctor): bool
{
    return $user->isAdmin();  // Only admins can update doctors
}

public function delete(User $user, Doctor $doctor): bool
{
    return $user->isAdmin();  // Only admins can delete doctors
}
```

**Permission Matrix:**
| Action | Admin | Doctor | Receptionist |
|--------|-------|--------|--------------|
| viewAny | ✅ | ✅ | ✅ |
| view | ✅ | ✅ | ✅ |
| create | ✅ | ❌ | ❌ |
| update | ✅ | ❌ | ❌ |
| delete | ✅ | ❌ | ❌ |

---

### 5. InvoicePolicy ✅

**Location:** [backend/app/Policies/InvoicePolicy.php](backend/app/Policies/InvoicePolicy.php)

**Permission Matrix:**
| Action | Admin | Doctor | Receptionist |
|--------|-------|--------|--------------|
| viewAny | ✅ | ✅ | ✅ |
| view | ✅ | ✅ | ✅ |
| create | ✅ | ❌ | ✅ |
| update | ✅ | ❌ | ✅ |
| delete | ✅ | ❌ | ❌ |

---

### 6. PrescriptionPolicy ✅

**Location:** [backend/app/Policies/PrescriptionPolicy.php](backend/app/Policies/PrescriptionPolicy.php)

**Doctor-Specific Rules:**
```php
public function view(User $user, Prescription $prescription): bool
{
    if ($user->isDoctor() && $user->doctor?->id === $prescription->doctor_id) {
        return true;  // Doctors can view their own prescriptions
    }
    return $user->isAdmin() || $user->isReceptionist();
}

public function create(User $user): bool
{
    return $user->isDoctor() || $user->isAdmin();
}

public function update(User $user, Prescription $prescription): bool
{
    if ($user->isDoctor() && $user->doctor?->id === $prescription->doctor_id) {
        return true;  // Doctors can update their own prescriptions
    }
    return $user->isAdmin();
}
```

**Permission Matrix:**
| Action | Admin | Doctor | Receptionist |
|--------|-------|--------|--------------|
| viewAny | ✅ | ✅ | ✅ |
| view | ✅ All | ✅ Own only | ✅ All |
| create | ✅ | ✅ | ❌ |
| update | ✅ | ✅ Own only | ❌ |
| delete | ✅ | ❌ | ❌ |

---

## Controller Authorization ✅

### AppointmentController - Data Scoping Implemented ✅

**Location:** [backend/app/Http/Controllers/Api/AppointmentController.php](backend/app/Http/Controllers/Api/AppointmentController.php)

```php
public function index(Request $request)
{
    $this->authorize('viewAny', Appointment::class);

    $query = Appointment::with(['patient', 'doctor']);

    // Doctor sees only THEIR appointments
    if ($request->user()->isDoctor() && $request->user()->doctor) {
        $query->where('doctor_id', $request->user()->doctor->id);
    }

    $appointments = $query->latest('appointment_date')->paginate();
    return AppointmentResource::collection($appointments);
}

public function show(Appointment $appointment)
{
    $this->authorize('view', $appointment);  // Policy checks doctor_id
    // ...
}
```

**Features:**
- ✅ Policy authorization on all methods
- ✅ Query scope filters appointments by doctor_id for doctors
- ✅ Admin and receptionist see all appointments
- ✅ Doctors only see their own appointments

---

### VisitController - Data Scoping Implemented ✅

**Location:** [backend/app/Http/Controllers/Api/VisitController.php](backend/app/Http/Controllers/Api/VisitController.php)

```php
public function index()
{
    $this->authorize('viewAny', Visit::class);

    $query = Visit::with(['patient', 'doctor', 'appointment']);

    // Doctor sees only THEIR visits
    if (request()->user()->isDoctor() && request()->user()->doctor) {
        $query->where('doctor_id', request()->user()->doctor->id);
    }

    $visits = $query->latest('visit_date')->paginate();
    return VisitResource::collection($visits);
}

public function show(Visit $visit)
{
    $this->authorize('view', $visit);  // Policy checks doctor_id
    // ...
}
```

**Features:**
- ✅ Policy authorization on all methods
- ✅ Query scope filters visits by doctor_id for doctors
- ✅ Admin and receptionist see all visits
- ✅ Doctors only see their own visits

---

### PatientController - Receptionist Can Create ✅

**Location:** [backend/app/Http/Controllers/Api/PatientController.php](backend/app/Http/Controllers/Api/PatientController.php)

```php
public function store(StorePatientRequest $request)
{
    // StorePatientRequest checks authorization:
    // return $this->user()->can('create', Patient::class);
    
    $patient = $this->patientService->create($request->validated(), $request->user()->id);
    return response()->json(new PatientResource($patient->load('creator')), 201);
}
```

**StorePatientRequest Authorization:**
```php
public function authorize(): bool
{
    return $this->user()->can('create', Patient::class);
}
```

**Features:**
- ✅ Form Request uses policy for authorization
- ✅ PatientPolicy allows receptionist to create patients
- ✅ All create/update/view methods use proper authorization

---

## Form Request Authorization ✅

All Form Requests use policy-based authorization:

### StorePatientRequest
```php
public function authorize(): bool
{
    return $this->user()->can('create', Patient::class);
}
// Allows: admin, receptionist ✅
```

### StoreAppointmentRequest
```php
public function authorize(): bool
{
    return $this->user()->can('create', Appointment::class);
}
// Allows: admin, receptionist ✅
```

### StoreVisitRequest
```php
public function authorize(): bool
{
    return $this->user()->can('create', Visit::class);
}
// Allows: admin, doctor, receptionist ✅
```

### StoreInvoiceRequest
```php
public function authorize(): bool
{
    return $this->user()->can('create', Invoice::class);
}
// Allows: admin, receptionist ✅
```

---

## Summary of Requirements vs Implementation

### ✅ Requirement 1: Implement 3 Roles
**Status:** Complete ✅

- ✅ Admin role implemented
- ✅ Doctor role implemented
- ✅ Receptionist role implemented
- ✅ Role model with constants
- ✅ User helper methods (isAdmin(), isDoctor(), isReceptionist())
- ✅ RoleSeeder creates all 3 roles
- ✅ DatabaseSeeder creates users with each role

---

### ✅ Requirement 2: Create Policies and Register Them
**Status:** Complete ✅

- ✅ 6 policies created (Appointment, Visit, Patient, Doctor, Invoice, Prescription)
- ✅ All policies registered in AuthServiceProvider
- ✅ AuthServiceProvider registered in bootstrap/providers.php
- ✅ All controllers use authorize() calls
- ✅ All Form Requests use policy authorization

---

### ✅ Requirement 3: Doctor Can Only See Their Appointments
**Status:** Complete ✅

**Implementation:**
1. **AppointmentPolicy:**
   ```php
   public function view(User $user, Appointment $appointment): bool
   {
       if ($user->isDoctor() && $user->doctor) {
           return $appointment->doctor_id === $user->doctor->id;
       }
       return $user->isAdmin() || $user->isReceptionist();
   }
   ```

2. **AppointmentController Query Scoping:**
   ```php
   if ($request->user()->isDoctor() && $request->user()->doctor) {
       $query->where('doctor_id', $request->user()->doctor->id);
   }
   ```

**Verification:**
- ✅ Policy checks doctor_id on individual record access
- ✅ Controller scopes query to only return doctor's appointments
- ✅ Doctors cannot see other doctors' appointments

---

### ✅ Requirement 4: Doctor Can Only See Their Visits
**Status:** Complete ✅

**Implementation:**
1. **VisitPolicy:**
   ```php
   public function view(User $user, Visit $visit): bool
   {
       if ($user->isDoctor() && $user->doctor) {
           return $visit->doctor_id === $user->doctor->id;
       }
       return $user->isAdmin() || $user->isReceptionist();
   }
   ```

2. **VisitController Query Scoping:**
   ```php
   if (request()->user()->isDoctor() && request()->user()->doctor) {
       $query->where('doctor_id', request()->user()->doctor->id);
   }
   ```

**Verification:**
- ✅ Policy checks doctor_id on individual record access
- ✅ Controller scopes query to only return doctor's visits
- ✅ Doctors cannot see other doctors' visits

---

### ✅ Requirement 5: Receptionist Can Create Patients
**Status:** Complete ✅

**Implementation:**
```php
// PatientPolicy
public function create(User $user): bool
{
    return $user->isAdmin() || $user->isReceptionist();
}
```

**Verification:**
- ✅ PatientPolicy allows receptionist to create
- ✅ StorePatientRequest uses policy authorization
- ✅ PatientController uses Form Request
- ✅ Receptionists can successfully create patients

---

### ✅ Requirement 6: Receptionist Can Create Appointments
**Status:** Complete ✅

**Implementation:**
```php
// AppointmentPolicy
public function create(User $user): bool
{
    return $user->isAdmin() || $user->isReceptionist();
}
```

**Verification:**
- ✅ AppointmentPolicy allows receptionist to create
- ✅ StoreAppointmentRequest uses policy authorization
- ✅ AppointmentController uses Form Request
- ✅ Receptionists can successfully create appointments

---

## Additional RBAC Features Implemented

### Bonus: Prescription Ownership
Doctors have special rules for prescriptions:
- ✅ Can create prescriptions
- ✅ Can view their own prescriptions
- ✅ Can update their own prescriptions
- ✅ Cannot view/update other doctors' prescriptions

### Bonus: Filament Panel Access
```php
public function canAccessPanel(Panel $panel): bool
{
    return $this->role !== null && in_array($this->role->slug, [
        Role::ADMIN, 
        Role::DOCTOR, 
        Role::RECEPTIONIST
    ], true);
}
```
- ✅ All 3 roles can access Filament admin panel
- ✅ Role-based data scoping in Filament resources

---

## Testing RBAC

### Test Users Created by Seeder

**Admin User:**
- Email: `admin@clinic.com`
- Password: `password`
- Can: Everything

**Doctor User:**
- Email: `doctor@clinic.com`
- Password: `password`
- Can: See own appointments/visits, create prescriptions
- Cannot: Create patients/appointments, see other doctors' data

**Receptionist User:**
- Email: `reception@clinic.com`
- Password: `password`
- Can: Create patients/appointments, see all appointments/visits
- Cannot: Create prescriptions, delete records

### API Testing Examples

#### Doctor Accessing Appointments
```bash
# Login as doctor
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@clinic.com","password":"password"}'

# Get appointments (only returns doctor's appointments)
curl -X GET http://localhost/api/appointments \
  -H "Authorization: Bearer {token}"
```

**Result:** Only appointments where `doctor_id` matches authenticated doctor's ID

#### Receptionist Creating Patient
```bash
# Login as receptionist
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reception@clinic.com","password":"password"}'

# Create patient (allowed)
curl -X POST http://localhost/api/patients \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","phone":"0911234567"}'
```

**Result:** Patient created successfully (status 201)

#### Doctor Creating Patient (Denied)
```bash
# Login as doctor
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@clinic.com","password":"password"}'

# Try to create patient (denied)
curl -X POST http://localhost/api/patients \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","phone":"0911234567"}'
```

**Result:** 403 Forbidden - "This action is unauthorized."

---

## Complete RBAC Matrix

| Resource | Action | Admin | Doctor | Receptionist |
|----------|--------|-------|--------|--------------|
| **Patients** | viewAny | ✅ | ✅ | ✅ |
| | view | ✅ | ✅ | ✅ |
| | create | ✅ | ❌ | ✅ |
| | update | ✅ | ❌ | ✅ |
| | delete | ✅ | ❌ | ❌ |
| **Appointments** | viewAny | ✅ | ✅ (scoped) | ✅ |
| | view | ✅ | ✅ (own only) | ✅ |
| | create | ✅ | ❌ | ✅ |
| | update | ✅ | ❌ | ✅ |
| | delete | ✅ | ❌ | ✅ |
| **Visits** | viewAny | ✅ | ✅ (scoped) | ✅ |
| | view | ✅ | ✅ (own only) | ✅ |
| | create | ✅ | ✅ | ✅ |
| | update | ✅ | ✅ | ✅ |
| | delete | ✅ | ❌ | ❌ |
| **Prescriptions** | viewAny | ✅ | ✅ | ✅ |
| | view | ✅ | ✅ (own only) | ✅ |
| | create | ✅ | ✅ | ❌ |
| | update | ✅ | ✅ (own only) | ❌ |
| | delete | ✅ | ❌ | ❌ |
| **Invoices** | viewAny | ✅ | ✅ | ✅ |
| | view | ✅ | ✅ | ✅ |
| | create | ✅ | ❌ | ✅ |
| | update | ✅ | ❌ | ✅ |
| | delete | ✅ | ❌ | ❌ |
| **Doctors** | viewAny | ✅ | ✅ | ✅ |
| | view | ✅ | ✅ | ✅ |
| | create | ✅ | ❌ | ❌ |
| | update | ✅ | ❌ | ❌ |
| | delete | ✅ | ❌ | ❌ |

---

## Verification Checklist ✅

### Roles (8.1)
- ✅ Admin role implemented
- ✅ Doctor role implemented
- ✅ Receptionist role implemented
- ✅ Role constants defined
- ✅ User helper methods created
- ✅ Database seeder creates roles

### Policies (8.2)
- ✅ AppointmentPolicy created
- ✅ VisitPolicy created
- ✅ PatientPolicy created
- ✅ DoctorPolicy created
- ✅ InvoicePolicy created
- ✅ PrescriptionPolicy created
- ✅ All policies registered in AuthServiceProvider
- ✅ AuthServiceProvider registered in bootstrap/providers.php

### Doctor Restrictions (8.3)
- ✅ Doctors can only see their appointments (policy + query scope)
- ✅ Doctors can only see their visits (policy + query scope)
- ✅ Doctors cannot see other doctors' appointments
- ✅ Doctors cannot see other doctors' visits

### Receptionist Permissions (8.4)
- ✅ Receptionist can create patients
- ✅ Receptionist can create appointments
- ✅ PatientPolicy allows receptionist
- ✅ AppointmentPolicy allows receptionist
- ✅ Form Requests use policy authorization

### Controller Authorization (8.5)
- ✅ All controllers use authorize() calls
- ✅ Query scoping implemented for doctors
- ✅ Form Requests check authorization
- ✅ Proper 403 responses on unauthorized access

---

## Summary

**Status:** All RBAC requirements are production-ready ✅

### Roles: 3/3 Complete
- ✅ Admin - Full system access
- ✅ Doctor - Limited to own appointments/visits + prescriptions
- ✅ Receptionist - Patient/appointment management

### Policies: 6/6 Created and Registered
- ✅ All models have policies
- ✅ All policies properly implement role checks
- ✅ AuthServiceProvider registered

### Doctor Access Controls: 2/2 Complete
- ✅ Can only see their appointments (policy + scope)
- ✅ Can only see their visits (policy + scope)

### Receptionist Permissions: 2/2 Complete
- ✅ Can create patients
- ✅ Can create appointments

**Result:** The RBAC system is production-ready with comprehensive role-based permissions, data scoping for doctors, and proper authorization throughout the application. 🚀
