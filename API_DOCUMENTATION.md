# API Documentation

## Base URL

```
http://localhost:8000/api
```

All API endpoints are prefixed with `/api`.

## Authentication

The API uses Laravel Sanctum for authentication with Bearer tokens.

### Login

**POST** `/api/login`

**Request Body:**
```json
{
  "email": "admin@clinic.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@clinic.com",
    "role": {
      "id": 1,
      "name": "Admin",
      "slug": "admin"
    }
  },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz",
  "token_type": "Bearer"
}
```

### Logout

**POST** `/api/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User

**GET** `/api/user`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@clinic.com",
  "role": {
    "id": 1,
    "name": "Admin",
    "slug": "admin"
  }
}
```

---

## Patients

### List Patients

**GET** `/api/patients`

**Query Parameters:**
- `per_page` (integer, optional): Items per page (default: 15)
- `page` (integer, optional): Page number

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Abebe",
      "last_name": "Kebede",
      "full_name": "Abebe Kebede",
      "phone": "+251922222222",
      "gender": "male",
      "date_of_birth": "1990-01-15",
      "address": "Addis Ababa, Ethiopia",
      "created_at": "2024-01-15T10:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

### Create Patient

**POST** `/api/patients`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+251911111111",
  "gender": "male",
  "date_of_birth": "1985-05-20",
  "address": "123 Main St, Addis Ababa"
}
```

**Response (201):**
```json
{
  "id": 2,
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe",
  "phone": "+251911111111",
  "gender": "male",
  "date_of_birth": "1985-05-20",
  "address": "123 Main St, Addis Ababa",
  "created_at": "2024-01-15T10:30:00.000000Z"
}
```

### Get Patient

**GET** `/api/patients/{id}`

**Response (200):**
```json
{
  "id": 1,
  "first_name": "Abebe",
  "last_name": "Kebede",
  "full_name": "Abebe Kebede",
  "phone": "+251922222222",
  "gender": "male",
  "date_of_birth": "1990-01-15",
  "address": "Addis Ababa, Ethiopia",
  "appointments": [...],
  "visits": [...],
  "invoices": [...],
  "created_at": "2024-01-15T10:00:00.000000Z"
}
```

### Update Patient

**PUT** `/api/patients/{id}`

**Request Body:**
```json
{
  "first_name": "John",
  "phone": "+251911111111",
  "address": "New Address"
}
```

### Delete Patient

**DELETE** `/api/patients/{id}`

**Response (204):** No Content

### Search Patients

**GET** `/api/patients/search?q={query}`

**Query Parameters:**
- `q` (string, required): Search term (name or phone)

**Response (200):**
```json
{
  "data": [...]
}
```

---

## Doctors

### List Doctors

**GET** `/api/doctors`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Dr. John Smith",
      "specialization": "General Practice",
      "phone": "+251911111111",
      "email": "doctor@clinic.com",
      "availability": {
        "monday": ["09:00", "10:00", "11:00"],
        "tuesday": ["09:00", "10:00"]
      }
    }
  ]
}
```

### Create Doctor

**POST** `/api/doctors`

**Request Body:**
```json
{
  "name": "Dr. Jane Doe",
  "specialization": "Cardiology",
  "phone": "+251922222222",
  "email": "jane@clinic.com",
  "availability": {
    "monday": ["09:00", "10:00"],
    "wednesday": ["14:00", "15:00"]
  },
  "user_id": 2
}
```

### Search Doctors

**GET** `/api/doctors/search?q={query}`

---

## Appointments

### List Appointments

**GET** `/api/appointments`

**Query Parameters:**
- `date` (date, optional): Filter by date (YYYY-MM-DD)
- `status` (string, optional): Filter by status (scheduled, completed, cancelled, no_show)
- `per_page` (integer, optional): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "patient": {...},
      "doctor": {...},
      "appointment_date": "2024-01-20",
      "timeslot": "09:00",
      "status": "scheduled",
      "notes": "Regular checkup"
    }
  ]
}
```

### Create Appointment

**POST** `/api/appointments`

**Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "appointment_date": "2024-01-20",
  "timeslot": "09:00",
  "notes": "Regular checkup"
}
```

**Response (201):**
```json
{
  "id": 1,
  "patient": {...},
  "doctor": {...},
  "appointment_date": "2024-01-20",
  "timeslot": "09:00",
  "status": "scheduled",
  "notes": "Regular checkup"
}
```

### Update Appointment Status

**PATCH** `/api/appointments/{id}/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid statuses:** scheduled, completed, cancelled, no_show

### Delete Appointment

**DELETE** `/api/appointments/{id}`

---

## Visits

### List Visits

**GET** `/api/visits`

**Query Parameters:**
- `per_page` (integer, optional): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "patient": {...},
      "doctor": {...},
      "visit_date": "2024-01-15T10:30:00.000000Z",
      "symptoms": "Fever and headache",
      "diagnosis": "Common cold",
      "treatment_notes": "Rest and fluids"
    }
  ]
}
```

### Create Visit

**POST** `/api/visits`

**Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "visit_date": "2024-01-15T10:30:00",
  "symptoms": "Fever and headache",
  "diagnosis": "Common cold",
  "treatment_notes": "Rest and fluids"
}
```

### Convert Appointment to Visit

**POST** `/api/visits/from-appointment/{appointmentId}`

Converts a scheduled appointment to a visit and marks the appointment as completed.

**Response (201):**
```json
{
  "id": 1,
  "patient": {...},
  "doctor": {...},
  "appointment_id": 1,
  "visit_date": "2024-01-15T10:30:00.000000Z"
}
```

### Update Visit

**PUT** `/api/visits/{id}`

**Request Body:**
```json
{
  "symptoms": "Updated symptoms",
  "diagnosis": "Updated diagnosis"
}
```

---

## Prescriptions

### List Prescriptions

**GET** `/api/prescriptions`

**Query Parameters:**
- `patient_id` (integer, optional): Filter by patient
- `visit_id` (integer, optional): Filter by visit
- `status` (string, optional): Filter by status (active, completed, cancelled)
- `per_page` (integer, optional): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "patient": {...},
      "doctor": {...},
      "visit": {...},
      "diagnosis": "Common cold",
      "notes": "Take with food",
      "status": "active",
      "items": [
        {
          "id": 1,
          "medication": "Paracetamol",
          "dosage": "500mg",
          "frequency": "3 times daily",
          "duration": "5 days",
          "instructions": "Take after meals"
        }
      ]
    }
  ]
}
```

### Create Prescription

**POST** `/api/prescriptions`

**Request Body:**
```json
{
  "visit_id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis": "Common cold",
  "notes": "Take with food",
  "status": "active",
  "items": [
    {
      "medication": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "duration": "5 days",
      "instructions": "Take after meals"
    }
  ]
}
```

### Update Prescription

**PUT** `/api/prescriptions/{id}`

---

## Invoices

### List Invoices

**GET** `/api/invoices`

**Query Parameters:**
- `payment_status` (string, optional): Filter by payment status (paid, unpaid, partial)
- `per_page` (integer, optional): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "patient": {...},
      "visit": {...},
      "subtotal": 1000.00,
      "discount": 100.00,
      "total": 900.00,
      "payment_status": "unpaid",
      "payment_method": null,
      "paid_at": null,
      "items": [
        {
          "id": 1,
          "description": "Consultation",
          "quantity": 1,
          "unit_price": 500.00,
          "amount": 500.00
        }
      ]
    }
  ]
}
```

### Create Invoice

**POST** `/api/invoices`

**Request Body:**
```json
{
  "visit_id": 1,
  "discount": 50.00,
  "items": [
    {
      "description": "Consultation",
      "quantity": 1,
      "unit_price": 500.00
    },
    {
      "description": "Lab Test",
      "quantity": 2,
      "unit_price": 250.00
    }
  ]
}
```

### Pay Invoice

**PATCH** `/api/invoices/{id}/pay`

**Request Body:**
```json
{
  "payment_method": "cash"
}
```

**Valid payment methods:** cash, card, insurance, bank_transfer

**Response (200):**
```json
{
  "id": 1,
  "payment_status": "paid",
  "payment_method": "cash",
  "paid_at": "2024-01-15T11:00:00.000000Z"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found."
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Server Error"
}
```

---

## Rate Limiting

- API requests are rate-limited to 60 requests per minute per user
- Exceeding the limit returns a 429 Too Many Requests response

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 15, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "links": {
    "first": "http://localhost:8000/api/patients?page=1",
    "last": "http://localhost:8000/api/patients?page=5",
    "prev": null,
    "next": "http://localhost:8000/api/patients?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "path": "http://localhost:8000/api/patients",
    "per_page": 15,
    "to": 15,
    "total": 75
  }
}
```
