# Clinic Management System - Setup and Testing Guide

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Environment Configuration](#environment-configuration)
3. [Running the Application](#running-the-application)
4. [Running Tests](#running-tests)
5. [Database Indexes](#database-indexes)
6. [Testing Scenarios](#testing-scenarios)

---

## 🗄️ Database Setup

### PostgreSQL Installation

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows (using pgAdmin or installer):**
- Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Follow the installer wizard
- PostgreSQL service will start automatically

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE clinic_management;
CREATE USER clinic_user WITH PASSWORD 'password123';
ALTER ROLE clinic_user SET client_encoding TO 'utf8';
ALTER ROLE clinic_user SET default_transaction_isolation TO 'read committed';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE clinic_management TO clinic_user;

# Exit
\q
```

---

## ⚙️ Environment Configuration

### Backend Setup

1. **Copy environment file:**
```bash
cd backend
cp .env.example .env
```

2. **Update database credentials** (if different from defaults):
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=clinic_management
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

3. **Sanctum & CORS Configuration:**
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_COOKIE_SAME_SITE=lax
FRONTEND_URL=http://localhost:5173
```

4. **Generate application key:**
```bash
php artisan key:generate
```

5. **Install dependencies:**
```bash
composer install
```

6. **Run migrations:**
```bash
php artisan migrate
```

7. **Seed database (optional):**
```bash
php artisan db:seed
```

### Frontend Setup

1. **Copy environment file:**
```bash
cd frontend
cp .env.example .env.local
```

2. **Verify API configuration:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

3. **Install dependencies:**
```bash
npm install
```

---

## 🚀 Running the Application

### Option 1: Using Run Script (Recommended)

```bash
# From project root
chmod +x run.sh
./run.sh
```

This script will:
- Create `.env` files if they don't exist
- Generate `APP_KEY` for Laravel
- Install backend dependencies (Composer)
- Install frontend dependencies (npm)
- Run database migrations
- Start Laravel server on `http://localhost:8000`
- Start Vite dev server on `http://localhost:5173`

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
php artisan migrate
php artisan serve
# Backend running on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

---

## 🧪 Running Tests

### Quick Test

```bash
cd backend
php artisan test
```

### Using Test Runner Script

```bash
# From project root
chmod +x run-tests.sh
./run-tests.sh
```

Then select test suite:
1. All Tests
2. Feature Tests Only
3. Unit Tests Only
4. Patient Creation Tests
5. Appointment Booking Tests
6. Invoice Payment Tests
7. Role Access Control Tests
8. All Tests with Coverage

### Run Specific Test Class

```bash
cd backend

# Patient creation tests
php artisan test tests/Feature/PatientCreationTest.php

# Appointment booking tests
php artisan test tests/Feature/AppointmentBookingTest.php

# Invoice payment tests
php artisan test tests/Feature/InvoicePaymentTest.php

# Role access control tests
php artisan test tests/Feature/RoleAccessControlTest.php
```

### Run with Coverage Report

```bash
cd backend
php artisan test --coverage
```

---

## 🗂️ Database Indexes

### Indexes Added

#### 1. Unique Index on `patients.phone`

```sql
ALTER TABLE patients ADD UNIQUE (phone);
```

**Purpose:** Prevent duplicate phone numbers in the system
**Benefits:**
- Prevents data duplication
- Enforces data integrity
- Enables fast lookups by phone number

**Query Example:**
```sql
SELECT * FROM patients WHERE phone = '+1234567890';
```

#### 2. Composite Index on `appointments(doctor_id, appointment_date, timeslot)`

```sql
CREATE INDEX appointments_doctor_date_timeslot ON appointments(doctor_id, appointment_date, timeslot);
```

**Purpose:** Optimize appointment queries and prevent double booking
**Benefits:**
- Prevents doctor double booking
- Fast retrieval of appointments by doctor and date
- Supports efficient range queries on appointment dates
- Enables quick conflict detection

**Query Example:**
```sql
SELECT * FROM appointments 
WHERE doctor_id = 1 
AND appointment_date = '2024-02-20' 
AND timeslot = '09:00-10:00';
```

---

## 🧪 Testing Scenarios

### Patient Creation Tests

**File:** `backend/tests/Feature/PatientCreationTest.php`

**Test Cases:**
1. ✅ Create patient with valid data
2. ✅ Validate duplicate phone number prevention
3. ✅ Validate required fields
4. ✅ Validate authentication required
5. ✅ Create patient with optional fields

**Running:**
```bash
cd backend
php artisan test tests/Feature/PatientCreationTest.php
```

### Appointment Booking Tests

**File:** `backend/tests/Feature/AppointmentBookingTest.php`

**Test Cases:**
1. ✅ Book appointment successfully
2. ✅ **Prevent double booking** (same doctor, date, timeslot)
3. ✅ Allow same patient multiple appointments (different times)
4. ✅ Validate invalid doctor rejection
5. ✅ Validate invalid patient rejection
6. ✅ Prevent past date bookings

**Double Booking Prevention Logic:**
The test creates an appointment for a doctor on a specific date and time, then attempts to book another appointment for the same doctor at the same time. This should fail with a 422 validation error.

**Running:**
```bash
cd backend
php artisan test tests/Feature/AppointmentBookingTest.php

# Specifically test double booking prevention:
php artisan test tests/Feature/AppointmentBookingTest.php --filter=double_booking
```

### Invoice Payment Tests

**File:** `backend/tests/Feature/InvoicePaymentTest.php`

**Test Cases:**
1. ✅ Mark invoice as paid successfully
2. ✅ Accept multiple payment methods (cash, bank_transfer, card)
3. ✅ Prevent payment of already paid invoices
4. ✅ Require authentication for payment
5. ✅ Handle invalid invoice ID
6. ✅ Validate payment method is required
7. ✅ Filter invoices by payment status

**Running:**
```bash
cd backend
php artisan test tests/Feature/InvoicePaymentTest.php
```

### Role Access Control Tests

**File:** `backend/tests/Feature/RoleAccessControlTest.php`

**Test Cases:**

**Patient Management:**
- ✅ Admin can create patients
- ✅ Receptionist can create patients
- ✅ Doctor cannot create patients (403)
- ✅ Guest cannot create patients (403)

**View Access:**
- ✅ Doctor can view visits
- ✅ Receptionist can view appointments
- ✅ Doctor only sees own appointments
- ✅ Admin can view invoices

**Delete Access:**
- ✅ Admin can delete patients
- ✅ Receptionist cannot delete patients (403)
- ✅ Doctor cannot delete patients (403)

**General:**
- ✅ Unauthenticated user cannot access API (401)
- ✅ Guest role has limited access

**Role Matrix:**

| Action | Admin | Doctor | Receptionist | Guest |
|--------|-------|--------|--------------|-------|
| View Patients | ✅ | ❌ | ✅ | ❌ |
| Create Patients | ✅ | ❌ | ✅ | ❌ |
| Delete Patients | ✅ | ❌ | ❌ | ❌ |
| View Appointments | ✅ | Own Only | ✅ | ❌ |
| Create Appointments | ❌ | ❌ | ✅ | ❌ |
| View Visits | ✅ | ✅ | ✅ | ❌ |
| Create Visits | ❌ | ✅ | ❌ | ❌ |
| View Invoices | ✅ | ❌ | ✅ | ❌ |
| Mark Invoice Paid | ✅ | ❌ | ❌ | ❌ |

**Running:**
```bash
cd backend
php artisan test tests/Feature/RoleAccessControlTest.php

# Test specific role access:
php artisan test tests/Feature/RoleAccessControlTest.php --filter=admin
php artisan test tests/Feature/RoleAccessControlTest.php --filter=doctor
```

---

## 🔧 Troubleshooting

### Database Connection Issues

**Error: `SQLSTATE[08006] could not connect to server`**

1. Check PostgreSQL is running:
```bash
# macOS
brew services list | grep postgresql

# Ubuntu
sudo systemctl status postgresql

# Windows
Check Services app for PostgreSQL service
```

2. Verify database credentials in `.env`
3. Ensure database exists: `createdb clinic_management`

### Migration Errors

**Error: `SQLSTATE[42P01] ERROR: relation "users" does not exist`**

1. Clear and rerun migrations:
```bash
php artisan migrate:refresh
php artisan migrate
php artisan db:seed
```

2. Check migration files are loading:
```bash
php artisan migrate:status
```

### Tests Fail

**Error: `SQLSTATE[08006] could not connect to server`**

The test database needs to be created:
```bash
createdb clinic_management_test
```

**Error: Tables don't exist**

Run in test environment:
```bash
php artisan migrate --env=testing
```

### Port Already in Use

**Error: `Address already in use` for port 8000 or 5173**

1. Kill existing process:
```bash
# Port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

2. Or use different ports:
```bash
php artisan serve --port=8001
npm run dev -- --port 5174
```

---

## 📝 Test Statistics

**Total Tests:** 28

**By Category:**
- Patient Creation: 5 tests
- Appointment Booking: 6 tests
- Invoice Payment: 7 tests
- Role Access Control: 12 tests (includes variations)

**Coverage:**
- Feature tests for core workflows
- Validation and error handling
- Authentication and authorization
- Database constraints (unique phone, double booking)

---

## 🔐 Test Database Cleanup

Tests automatically clean up using `RefreshDatabase` trait:
- Database is reset before each test
- No manual cleanup needed
- Each test runs in isolation

---

## 📚 References

- [Laravel Testing Documentation](https://laravel.com/docs/11.x/testing)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)
- [PHPUnit Documentation](https://phpunit.de/documentation.html)

---

**Setup Status:** ✅ Complete

Ready to develop and test! 🎉
