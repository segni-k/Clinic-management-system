import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import PatientForm from './pages/PatientForm';
import Appointments from './pages/Appointments';
import Visits from './pages/Visits';
import VisitForm from './pages/VisitForm';
import Invoices from './pages/Invoices';
import './index.css';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="flex min-h-screen items-center justify-center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/new" element={<PatientForm />} />
            <Route path="patients/:id" element={<PatientProfile />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="visits" element={<Visits />} />
            <Route path="visits/new" element={<VisitForm />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
