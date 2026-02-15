# Clinic Management System

A production-ready clinic management system with Laravel 12 API, Filament v4 admin panel, and React frontend.

## Tech Stack

- **Backend:** Laravel 12 (API only), PostgreSQL/SQLite, Laravel Sanctum
- **Admin:** Filament v4
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Auth:** API tokens (Sanctum)

## Quick Start

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Default runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` (proxies `/api` to backend)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clinic.com | password |
| Doctor | doctor@clinic.com | password |
| Receptionist | reception@clinic.com | password |

## Project Structure

```
wqp/
├── backend/           # Laravel API + Filament
│   ├── app/
│   │   ├── Filament/  # Admin resources
│   │   ├── Http/      # Controllers, Requests, Resources
│   │   ├── Models/
│   │   ├── Policies/
│   │   ├── Repositories/
│   │   └── Services/
│   └── database/migrations/
└── frontend/          # React + Vite
    └── src/
        ├── api/       # Axios services
        ├── components/
        ├── context/
        └── pages/
```

## API Endpoints

- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Current user
- `GET/POST /api/patients` - Patients
- `GET /api/patients/search?q=` - Search patients
- `GET/POST /api/appointments` - Appointments
- `PATCH /api/appointments/{id}/status` - Update status
- `POST /api/visits/from-appointment/{id}` - Convert appointment to visit
- `GET/POST /api/visits` - Visits
- `GET/POST /api/invoices` - Invoices
- `PATCH /api/invoices/{id}/pay` - Mark invoice paid
- `GET /api/doctors` - List doctors

## Admin Panel

Access at `http://localhost:8000/admin` after backend is running. Use same demo credentials.

## Database (PostgreSQL)

To use PostgreSQL, update `.env`:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=clinic
DB_USERNAME=postgres
DB_PASSWORD=
```
