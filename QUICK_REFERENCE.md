# Quick Reference Guide

## 🚀 Getting Started

### First Time Setup
```bash
git clone <repository>
cd Clinic-management-system
./setup.sh
```

### Start Development
```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Access
- Frontend: http://localhost:5173
- API: http://localhost:8000/api
- Admin: http://localhost:8000/admin

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clinic.com | password |
| Doctor | doctor@clinic.com | password |
| Receptionist | reception@clinic.com | password |

---

## 📁 Key File Locations

### Backend Architecture
```
backend/app/
├── Http/Controllers/Api/     # HTTP handlers (thin)
├── Services/                 # Business logic ⭐
├── Repositories/            # Database queries ⭐
├── Policies/                # Authorization
├── Http/Requests/           # Validation
├── Http/Resources/          # API responses
├── Models/                  # Eloquent models
└── Filament/Resources/      # Admin panel
```

### Frontend
```
frontend/src/
├── api/
│   ├── axios.ts            # HTTP client setup
│   └── services.ts         # API functions ⭐
├── context/
│   └── AuthContext.tsx     # Auth state
├── pages/                  # React pages
└── components/             # Reusable components
```

---

## 🛠️ Common Commands

### Backend (Laravel)
```bash
# Migrations
php artisan migrate              # Run migrations
php artisan migrate:fresh --seed # Fresh DB with data
php artisan migrate:rollback     # Undo last migration

# Cache
php artisan config:cache         # Cache config (production)
php artisan route:cache          # Cache routes (production)
php artisan cache:clear          # Clear all cache

# Development
php artisan serve                # Start dev server
php artisan tinker               # Laravel REPL
php artisan make:model Model     # Create model
php artisan make:controller Controller # Create controller
php artisan make:request Request # Create form request
php artisan make:policy Policy   # Create policy

# Filament
php artisan filament:user        # Create admin user
```

### Frontend (React)
```bash
npm run dev                      # Start dev server
npm run build                    # Build for production
npm run preview                  # Preview production build
```

---

## 📡 API Quick Reference

### Authentication
```bash
# Login
POST /api/login
Body: {"email": "admin@clinic.com", "password": "password"}

# Get current user
GET /api/user
Header: Authorization: Bearer {token}

# Logout
POST /api/logout
Header: Authorization: Bearer {token}
```

### Common Patterns

#### List with Pagination
```bash
GET /api/patients?page=1&per_page=15
```

#### Create
```bash
POST /api/patients
Body: {"first_name": "John", "last_name": "Doe", ...}
```

#### Get Single
```bash
GET /api/patients/1
```

#### Update
```bash
PUT /api/patients/1
Body: {"phone": "+251911111111"}
```

#### Delete
```bash
DELETE /api/patients/1
```

#### Search
```bash
GET /api/patients/search?q=John
```

---

## 🔐 Authorization Levels

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to everything |
| **Doctor** | View/manage own appointments, visits, prescriptions |
| **Receptionist** | Manage patients, appointments, invoices |

---

## 🗄️ Database

### Connection
Edit `backend/.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=clinic_management
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### Reset Database
```bash
cd backend
php artisan migrate:fresh --seed
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `vendor/autoload.php not found`
```bash
cd backend
composer install
```

**Problem:** `APP_KEY not set`
```bash
php artisan key:generate
```

**Problem:** Database errors
```bash
# Check .env database settings
# Then run:
php artisan migrate:fresh --seed
```

### Frontend Issues

**Problem:** `node_modules not found`
```bash
cd frontend
npm install
```

**Problem:** API connection refused
```bash
# Check VITE_API_URL in frontend/.env
# Make sure backend is running (php artisan serve)
```

**Problem:** 401 Unauthorized
```bash
# Token expired or invalid
# Log out and log in again
```

---

## 📝 Code Patterns

### Adding New Feature (Example: Lab Tests)

#### 1. Create Migration
```bash
php artisan make:migration create_lab_tests_table
```

#### 2. Create Model
```bash
php artisan make:model LabTest
```

#### 3. Create Repository
```php
// app/Repositories/LabTestRepository.php
class LabTestRepository {
    public function findById(int $id): ?LabTest { ... }
}
```

#### 4. Create Service
```php
// app/Services/LabTestService.php
class LabTestService {
    public function __construct(protected LabTestRepository $repository) {}
    public function create(array $data): LabTest { ... }
}
```

#### 5. Create Controller
```php
// app/Http/Controllers/Api/LabTestController.php
class LabTestController extends Controller {
    public function __construct(protected LabTestService $service) {}
    public function store(Request $request) { 
        return $this->service->create($request->validated());
    }
}
```

#### 6. Create Form Request
```bash
php artisan make:request StoreLabTestRequest
```

#### 7. Create Policy
```bash
php artisan make:policy LabTestPolicy
```

#### 8. Add Routes
```php
// routes/api.php
Route::apiResource('lab-tests', LabTestController::class);
```

#### 9. Create Filament Resource (Optional)
```bash
php artisan make:filament-resource LabTest --generate
```

---

## 🎨 Styling Guidelines

### Backend (Laravel)
- Use type hints
- Return types on all methods
- Keep controllers thin (< 60 lines)
- All logic in Services
- All queries in Repositories

### Frontend (React)
- Use TypeScript
- Functional components with hooks
- Extract reusable logic to custom hooks
- Keep components small (< 200 lines)

---

## 📚 Additional Resources

- [Laravel Docs](https://laravel.com/docs)
- [Filament Docs](https://filamentphp.com/docs)
- [React Docs](https://react.dev)
- [Sanctum Docs](https://laravel.com/docs/sanctum)

---

## 🔍 Where to Find Things

| Need | Location |
|------|----------|
| Add business logic | `backend/app/Services/` |
| Add database query | `backend/app/Repositories/` |
| Add API endpoint | `backend/app/Http/Controllers/Api/` |
| Add validation | `backend/app/Http/Requests/` |
| Add authorization | `backend/app/Policies/` |
| Add admin form | `backend/app/Filament/Resources/` |
| Add frontend page | `frontend/src/pages/` |
| Add API call | `frontend/src/api/services.ts` |

---

## ✅ Pre-Deployment Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Set strong `APP_KEY` (run `php artisan key:generate`)
- [ ] Configure production database
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan migrate --force`
- [ ] Set up queue worker
- [ ] Configure SSL/HTTPS
- [ ] Set proper file permissions (775 for directories, 664 for files)
- [ ] Set `storage` and `bootstrap/cache` writable
- [ ] Build frontend: `npm run build`
- [ ] Point domain to `backend/public`

---

## 🆘 Need Help?

1. Check the [README.md](README.md) for detailed documentation
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Check [CHANGELOG.md](CHANGELOG.md) for implementation details
4. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture overview

---

**Last Updated:** February 17, 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
