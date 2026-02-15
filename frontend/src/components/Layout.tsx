import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-emerald-100 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-slate-800">Clinic Management</Link>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>{user?.name ?? user?.email}</span>
            <button onClick={handleLogout} className="rounded-md bg-slate-800 px-3 py-1.5 text-white hover:bg-slate-900">Logout</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-lg bg-white p-3 shadow">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={navClass}>Dashboard</NavLink>
            <NavLink to="/patients" className={navClass}>Patients</NavLink>
            <NavLink to="/appointments" className={navClass}>Appointments</NavLink>
            <NavLink to="/visits" className={navClass}>Visits</NavLink>
            <NavLink to="/invoices" className={navClass}>Invoices</NavLink>
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
