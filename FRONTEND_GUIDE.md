# Frontend Implementation Guide - Modern React UI

**Version:** 1.0  
**Last Updated:** February 17, 2026  
**Status:** ✅ Complete and Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Component Library](#component-library)
3. [Pages](#pages)
4. [Authentication](#authentication)
5. [API Integration](#api-integration)
6. [Styling & Design](#styling--design)
7. [Responsive Design](#responsive-design)

---

## Overview

The Clinic Management System frontend is a modern, eye-catching React application built with the latest technologies:

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **React Router v7** - Client-side routing
- **Axios** - HTTP client with interceptors

### Key Features

✅ **Modern UI/UX** - Professional, clean design with smooth animations  
✅ **Fully Responsive** - Perfect on mobile, tablet, and desktop  
✅ **Type-Safe** - Complete TypeScript coverage  
✅ **Fast** - Optimized with Vite HMR  
✅ **Accessible** - WCAG compliant components  
✅ **Secure** - Token-based auth with auto-refresh  

---

## Component Library

### Button (`components/Button.tsx`)

Versatile button component with multiple variants and sizes.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}
```

**Usage:**
```tsx
<Button variant="primary" size="lg">
  Submit
</Button>

<Button variant="outline" loading={isLoading}>
  Save Changes
</Button>
```

**Features:**
- 5 color variants
- 3 size options
- Loading state with spinner
- Disabled state handling
- Focus ring for accessibility

---

### Input (`components/Input.tsx`)

Form input with label, error, and helper text support.

**Props:**
```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}
```

**Usage:**
```tsx
<Input
  label="Email Address"
  type="email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

**Features:**
- Label with required indicator
- Error state with red border
- Helper text support
- Focus ring animation
- Forwarded ref support

---

### Card (`components/Card.tsx`)

Container component with header, body, and footer sections.

**Components:**
- `<Card>` - Main container
- `<CardHeader>` - Header section
- `<CardBody>` - Body section
- `<CardFooter>` - Footer section

**Usage:**
```tsx
<Card hover>
  <CardHeader>
    <h2>Patient Details</h2>
  </CardHeader>
  <CardBody>
    <p>Patient information here...</p>
  </CardBody>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

**Features:**
- Rounded corners with shadow
- Hover effect (optional)
- Separated sections
- Click handler support

---

### Badge (`components/Badge.tsx`)

Status indicator with color-coded variants.

**Props:**
```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  size?: 'sm' | 'md';
}
```

**Usage:**
```tsx
<Badge variant="success">Completed</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

**Features:**
- 5 color variants
- 2 size options
- Rounded pill shape
- Border styling

---

### StatCard (`components/StatCard.tsx`)

Dashboard statistics card with icon and trend.

**Props:**
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; isPositive: boolean };
  color?: 'emerald' | 'blue' | 'purple' | 'orange' | 'red';
}
```

**Usage:**
```tsx
<StatCard
  title="Total Patients"
  value={156}
  icon={<Icons.Patients />}
  trend={{ value: "+12%", isPositive: true }}
  color="blue"
/>
```

**Features:**
- Colored icon container
- Trend indicator with arrow
- Hover effect
- Click handler support

---

### Table (`components/Table.tsx`)

Responsive table with header, body, and row components.

**Components:**
- `<Table>` - Table wrapper
- `<TableHeader>` - Header section
- `<TableBody>` - Body section
- `<TableRow>` - Row with hover
- `<TableHead>` - Header cell
- `<TableCell>` - Data cell

**Usage:**
```tsx
<Table>
  <TableHeader>
    <tr>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </tr>
  </TableHeader>
  <TableBody>
    <TableRow onClick={() => handleView(id)}>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Features:**
- Responsive horizontal scroll
- Hover effects on rows
- Click handler support
- Zebra striping (optional)

---

### Icons (`components/Icons.tsx`)

SVG icon library with consistent sizing.

**Available Icons:**
- Dashboard, Patients, Calendar, Clipboard, Document
- User, Logout, Plus, Search, Filter
- Edit, Trash, Eye, ChevronRight, Menu, Close
- Chart, Clock, Check, X

**Usage:**
```tsx
<Icons.Calendar />
<Icons.Plus />
<Icons.Search />
```

**Features:**
- Consistent 20px/24px sizing
- Stroke-based design
- Accessible with current color
- Tree-shakeable exports

---

## Pages

### Dashboard (`pages/Dashboard.tsx`)

Overview page with statistics and today's appointments.

**Features:**
- 4 stat cards (Appointments, Patients, Revenue, Pending Invoices)
- Today's appointments table
- Color-coded status badges
- Loading states
- Empty states

**API Calls:**
- `appointmentsApi.list({ date: today })`
- `patientsApi.list()`
- `invoicesApi.list({ payment_status: 'paid' })`
- `invoicesApi.list({ payment_status: 'unpaid' })`

---

### Patients (`pages/Patients.tsx`)

Patient list with search and CRUD operations.

**Features:**
- Search by name, phone, or email
- Table with patient details
- Clickable rows to view patient
- Empty state with call-to-action
- Loading skeleton

**API Calls:**
- `patientsApi.list()`
- `patientsApi.search(query)`

---

### Appointments (`pages/Appointments.tsx`)

Appointment scheduling and management.

**Features:**
- Create appointment form
- Inline form toggle
- Patient and doctor dropdowns
- Date and time slot input
- Status badges
- Empty state

**API Calls:**
- `appointmentsApi.list()`
- `appointmentsApi.create(data)`
- `patientsApi.list()`
- `doctorsApi.list()`

---

### Visits (`pages/Visits.tsx`)

Clinical visit records.

**Features:**
- Visit history table
- Patient and doctor columns
- Visit date with time
- Symptoms and diagnosis display
- Truncated text for long content

**API Calls:**
- `visitsApi.list()`

---

### Invoices (`pages/Invoices.tsx`)

Billing and payment management.

**Features:**
- Invoice list table
- Amount with ETB formatting
- Status badges (paid/pending/overdue)
- "Mark Paid" button for unpaid
- Date formatting
- Loading states

**API Calls:**
- `invoicesApi.list()`
- `invoicesApi.pay(id, method)`

---

### Login (`pages/Login.tsx`)

Beautiful authentication page.

**Features:**
- Modern gradient background
- Logo and branding
- Email and password inputs
- Loading state
- Error handling
- Demo credentials display

**Design Highlights:**
- Gradient background (emerald to blue)
- Rounded card with shadow
- Icon with brand colors
- Responsive layout
- Auto-focus on email

---

## Authentication

### Auth Context (`context/AuthContext.tsx`)

Context provider for authentication state.

**Features:**
- User state management
- Login/logout functions
- Token storage
- Loading states
- Auto-redirect on 401

**Usage:**
```tsx
const { user, login, logout, loading } = useAuth();

await login(email, password);
logout();
```

**Protected Routes:**
```tsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}
```

---

## API Integration

### Axios Setup (`api/axios.ts`)

Configured axios instance with interceptors.

**Features:**
- Base URL from environment
- Auth token injection
- 401 auto-redirect
- JSON content type
- Error handling

**Request Interceptor:**
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```typescript
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

---

### API Services (`api/services.ts`)

Service functions for API calls.

**Available Services:**
- `patientsApi` - CRUD operations
- `doctorsApi` - Doctor management
- `appointmentsApi` - Scheduling
- `visitsApi` - Visit records
- `invoicesApi` - Billing

**Example:**
```typescript
export const patientsApi = {
  list: () => api.get('/patients'),
  get: (id: number) => api.get(`/patients/${id}`),
  create: (data: any) => api.post('/patients', data),
  update: (id: number, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: number) => api.delete(`/patients/${id}`),
  search: (q: string) => api.get(`/patients/search?q=${q}`),
};
```

---

## Styling & Design

### Color Palette

```css
Primary:    #10b981  (Emerald)
Secondary:  #6b7280  (Gray)
Info:       #3b82f6  (Blue)
Success:    #10b981  (Green)
Warning:    #f59e0b  (Orange)
Danger:     #ef4444  (Red)
```

### Typography

- **Headings:** Inter, Bold (24-32px)
- **Body:** Inter, Regular (14-16px)
- **Labels:** Inter, Medium (12-14px)
- **Monospace:** SF Mono, Regular (14px)

### Shadows

```css
sm:  0 1px 2px rgba(0, 0, 0, 0.05)
md:  0 4px 6px rgba(0, 0, 0, 0.1)
lg:  0 10px 15px rgba(0, 0, 0, 0.1)
xl:  0 20px 25px rgba(0, 0, 0, 0.1)
```

### Border Radius

```css
rounded:     0.375rem (6px)
rounded-lg:  0.5rem (8px)
rounded-xl:  0.75rem (12px)
rounded-2xl: 1rem (16px)
```

---

## Responsive Design

### Breakpoints

```css
sm:  640px   (Mobile landscape)
md:  768px   (Tablet portrait)
lg:  1024px  (Tablet landscape / Desktop)
xl:  1280px  (Desktop large)
2xl: 1536px  (Desktop extra large)
```

### Mobile Optimizations

**Sidebar:**
- Hidden by default
- Slide-in from left
- Backdrop overlay
- Close on navigation

**Tables:**
- Horizontal scroll
- Compact padding
- Hidden columns (optional)

**Forms:**
- Full-width inputs
- Stacked on mobile
- Larger touch targets

**Cards:**
- Full-width on mobile
- Reduced padding
- Stacked buttons

---

## Best Practices

### Component Usage

✅ **DO:**
- Use semantic HTML
- Forward refs when needed
- Provide loading states
- Handle empty states
- Show error messages

❌ **DON'T:**
- Hardcode colors
- Inline styles
- Skip TypeScript types
- Ignore accessibility
- Forget mobile testing

### Performance

- Use `React.memo` for expensive components
- Lazy load routes with `React.lazy`
- Debounce search inputs
- Paginate large lists
- Optimize images

### Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader testing

---

## Summary

The frontend is a complete, modern React application with:

✅ **8 Reusable Components** - Button, Input, Card, Badge, StatCard, Table, Icons  
✅ **7 Pages** - Dashboard, Patients, Appointments, Visits, Invoices, Login, Patient Profile  
✅ **Modern Layout** - Responsive sidebar with mobile menu  
✅ **Type-Safe API** - Axios with TypeScript  
✅ **Auth System** - Context-based with token management  
✅ **Responsive Design** - Mobile-first approach  
✅ **Production Ready** - Optimized and tested  

**System Status:** 🟢 Complete and Ready for Deployment
