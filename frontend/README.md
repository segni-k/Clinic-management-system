# Frontend - React + Vite + Tailwind CSS

Modern, responsive clinic management system frontend built with React 19, TypeScript, Vite, and Tailwind CSS 4.

## 🚀 Features

- ✅ **Modern UI/UX** - Clean, professional design with Tailwind CSS 4
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Fast Development** - Hot module replacement with Vite
- ✅ **Authentication** - Secure token-based auth with context API
- ✅ **Protected Routes** - Role-based access control
- ✅ **API Integration** - Axios with auth interceptors
- ✅ **Modern Components** - Reusable UI components library

## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 🎨 Component Library

### UI Components

- `<Button />` - Versatile button with variants (primary, secondary, danger, success, outline)
- `<Input />` - Form input with label, error, and helper text support
- `<Card />` - Container with header, body, and footer sections
- `<Badge />` - Status indicators with color variants
- `<StatCard />` - Dashboard statistics card with icon
- `<Table />` - Responsive table with header, body, and row components
- `<Icons />` - SVG icon library

### Pages

- **Dashboard** - Statistics overview with today's appointments
- **Patients** - Patient list with search and CRUD operations
- **Appointments** - Schedule and manage appointments
- **Visits** - Clinical visit records
- **Invoices** - Billing and payment management
- **Login** - Beautiful authentication page

## 🏗️ Project Structure

```
src/
├── api/
│   ├── axios.ts           # Axios instance with interceptors
│   └── services.ts        # API service functions
├── components/
│   ├── Badge.tsx          # Status badge component
│   ├── Button.tsx         # Reusable button component
│   ├── Card.tsx           # Card container components
│   ├── Icons.tsx          # SVG icon library
│   ├── Input.tsx          # Form input component
│   ├── Layout.tsx         # Main layout with sidebar
│   ├── StatCard.tsx       # Dashboard stat card
│   └── Table.tsx          # Table components
├── context/
│   └── AuthContext.tsx    # Authentication context
├── pages/
│   ├── Appointments.tsx   # Appointments management
│   ├── Dashboard.tsx      # Dashboard overview
│   ├── Invoices.tsx       # Invoice management
│   ├── Login.tsx          # Login page
│   ├── Patients.tsx       # Patient list
│   ├── PatientForm.tsx    # Patient form
│   ├── PatientProfile.tsx # Patient detail view
│   └── Visits.tsx         # Visit records
├── App.tsx                # Main app component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your backend URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

6. Open browser:
   ```
   http://localhost:5173
   ```

## 🎨 Design System

### Colors

- **Primary** - Emerald Green (#10b981) - Main actions and highlights
- **Info** - Blue (#3b82f6) - Information and scheduled status
- **Success** - Green (#10b981) - Success states and completed
- **Warning** - Orange (#f59e0b) - Warnings and pending status
- **Danger** - Red (#ef4444) - Errors and cancelled status
- **Secondary** - Gray - Neutral elements

### Typography

- **Headings** - Bold, clear hierarchy
- **Body** - 14-16px, readable spacing
- **Labels** - Uppercase, 12px for tertiary info

### Spacing

- Consistent 4px grid system
- Generous whitespace for breathing room
- Responsive padding and margins

## 🔐 Authentication

The app uses token-based authentication:

1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. 401 responses auto-redirect to login

### Demo Accounts

```
Admin:        admin@clinic.com / password
Doctor:       doctor@clinic.com / password
Receptionist: receptionist@clinic.com / password
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- Collapsible sidebar with hamburger menu
- Touch-optimized buttons and inputs
- Responsive tables with horizontal scroll
- Stacked forms and cards
- Full-width mobile layouts

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Style

- **TypeScript** for type safety
- **Functional components** with hooks
- **Tailwind CSS** for styling
- **Context API** for state management
- **Async/await** for promises

### Adding a New Page

1. Create page in `src/pages/`
2. Add route in `App.tsx`
3. Add navigation link in `Layout.tsx`
4. Create API service function if needed

## 🚀 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Output will be in `dist/` directory.

## 🎯 API Integration

### Axios Configuration

All API calls use the configured axios instance (`api`) from `api/axios.ts`:

```typescript
import { api } from '../api/axios';

// Automatically includes auth token and baseURL
const response = await api.get('/patients');
```

### Available Services

- `patientsApi` - Patient CRUD operations
- `doctorsApi` - Doctor management
- `appointmentsApi` - Appointment scheduling
- `visitsApi` - Visit records
- `invoicesApi` - Billing operations

## 🎨 Customization

### Colors

Update Tailwind colors in `index.css`:

```css
@layer base {
  :root {
    --color-primary: #10b981;
    /* Add more custom colors */
  }
}
```

### Components

All components are in `src/components/` and can be customized:

- Props interface for type safety
- Tailwind classes for styling
- Forwardedref for flexibility

## 📄 License

Part of the Clinic Management System - All Rights Reserved

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using React, TypeScript, Vite, and Tailwind CSS**
