# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ and npm
- PHP 8.2+ and Composer
- PostgreSQL 14+
- Git

---

## 🎯 Installation (5 Minutes)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### 2. Backend Setup (if not already done)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**Backend will run on:** `http://localhost:8000`

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@clinic.com | password |
| **Doctor** | doctor@clinic.com | password |
| **Receptionist** | receptionist@clinic.com | password |

---

## 📋 Testing the Complete Flow (2 Minutes)

### Step-by-Step Verification:

1. **Login**
   - Go to `http://localhost:5173`
   - Login with `doctor@clinic.com` / `password`
   - Verify redirect to Dashboard

2. **Create Patient**
   - Click "Patients" in sidebar
   - Click "Add Patient" button
   - Fill form:
     - First Name: "John"
     - Last Name: "Doe"
     - Phone: "+251912345678"
     - Gender: "Male"
     - Date of Birth: "1990-01-01"
   - Click "Save Patient"
   - **Expected:** Redirect to patients list, see John Doe

3. **Search Patient**
   - Type "John" in search box
   - **Expected:** John Doe appears in filtered results

4. **Create Appointment**
   - Click "Appointments" in sidebar
   - Click "New Appointment" button
   - Select:
     - Patient: John Doe
     - Doctor: (any doctor)
     - Date: Tomorrow's date
     - Time Slot: "09:00-10:00"
   - Click "Save Appointment"
   - **Expected:** Modal closes, appointment appears in table

5. **Convert to Visit** (Doctor Only)
   - Find the appointment you just created
   - Click "Convert to Visit" button
   - **Expected:** 
     - Button shows loading spinner
     - Appointment status changes to "Completed"
     - Visit record created in backend

6. **Manual Visit with Prescription & Invoice**
   - Click "Visits" in sidebar
   - Click "New Visit" button (doctor only)
   - Fill Visit Information:
     - Patient: John Doe
     - Visit Date: Today
     - Symptoms: "Headache and fever"
     - Diagnosis: "Flu"
     - Treatment: "Rest and medication"
   - Check "Add Prescription" checkbox
   - Fill Prescription:
     - Medication: "Paracetamol"
     - Dosage: "500mg"
     - Frequency: "3 times daily"
     - Duration: "5 days"
   - Verify "Create Invoice" is checked
   - Fill Invoice:
     - Consultation Fee: 300
     - Additional Charges: 50
   - **Expected:** Total shows "350.00"
   - Click "Save Visit"
   - **Expected:** Redirect to visits list, see new visit

7. **View Patient Profile**
   - Go back to Patients list
   - Click on "John Doe" row
   - Click "Visits" tab
   - **Expected:** See 2 visits (converted + manual)
   - Click "Prescriptions" tab
   - **Expected:** See Paracetamol prescription
   - Click "Invoices" tab
   - **Expected:** See invoice for 350.00 ETB with "Unpaid" status

8. **Mark Invoice Paid**
   - Click "Invoices" in sidebar
   - Find John Doe's invoice (350.00 ETB)
   - Click "Mark Paid" button
   - **Expected:**
     - Button shows loading spinner
     - Status badge changes to green "Paid"
     - "Mark Paid" button disappears

---

## ✅ Success Indicators

After completing the flow, you should have:

- ✅ 1 Patient (John Doe)
- ✅ 2 Appointments (1 completed, 1 scheduled)
- ✅ 2 Visits (from conversion + manual)
- ✅ 1 Prescription (Paracetamol)
- ✅ 1 Invoice (350.00 ETB, status: Paid)

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /"
**Solution:** Frontend not running. Run `npm run dev` in frontend folder.

### Issue: "Network Error" or "401 Unauthorized"
**Solution:** Backend not running or wrong API URL. Check:
- Backend is running on `http://localhost:8000`
- `frontend/.env` has correct `VITE_API_URL`
- Login again to refresh token

### Issue: "Convert to Visit" button not visible
**Solution:** You're not logged in as a doctor. Login with `doctor@clinic.com`.

### Issue: TypeScript errors in editor
**Solution:** Expected before `npm install`. Run installation commands.

### Issue: "No patients found" after creating patient
**Solution:** Check browser console for API errors. Verify backend is seeded with doctors.

### Issue: React errors in console
**Solution:** Clear localStorage and refresh:
```javascript
localStorage.clear()
location.reload()
```

---

## 🎨 UI Components Available

### Reusable Components:
- `<Modal>` - Dialog with backdrop
- `<DataTable>` - Searchable/sortable table
- `<StatusBadge>` - Colored status indicators
- `<LoadingSpinner>` - Loading state
- `<Button>` - Variants and sizes
- `<Input>` - Form input with label
- `<Card>` - Container component
- `<Icons>` - SVG icon library

### Pages:
- `/` - Dashboard with stats
- `/patients` - Patient list
- `/patients/new` - Create patient
- `/patients/:id` - Patient profile
- `/appointments` - Appointments list
- `/visits` - Visits list
- `/visits/new` - Create visit (doctor only)
- `/invoices` - Invoices list

---

## 📚 Documentation

For detailed information, see:
- `INTEGRATION_GUIDE.md` - Complete workflow documentation
- `PAGES_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `FRONTEND_GUIDE.md` - Component and API documentation
- `API_DOCUMENTATION.md` - Backend API reference

---

## 🚀 Ready to Go!

**Frontend:** Modern React 19 + TypeScript + Tailwind CSS 4  
**Backend:** Laravel 12 + PostgreSQL + Sanctum  
**Status:** ✅ Production Ready

Run `npm install` in frontend directory and start testing! 🎉

---

## 📞 Quick Commands Reference

```bash
# Frontend
cd frontend
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend
composer install     # Install dependencies
php artisan serve    # Start dev server (http://localhost:8000)
php artisan migrate  # Run migrations
php artisan db:seed  # Seed database

# Both
npm run dev & cd ../backend && php artisan serve &
```

Happy coding! 🎉
