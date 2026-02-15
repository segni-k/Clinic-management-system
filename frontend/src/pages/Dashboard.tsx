import { useEffect, useState } from 'react';
import { appointmentsApi, invoicesApi, patientsApi } from '../api/services';

export default function Dashboard() {
  const [stats, setStats] = useState({ appointments: 0, patients: 0, revenue: 0, pending: 0 });
  const [appointments, setAppointments] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    Promise.all([
      appointmentsApi.list({ date: today }),
      patientsApi.list(),
      invoicesApi.list({ payment_status: 'paid' }),
      invoicesApi.list({ payment_status: 'unpaid' }),
    ]).then(([aptRes, patRes, paidRes, unpaidRes]) => {
      const aptData = aptRes.data?.data ?? aptRes.data ?? [];
      const patData = patRes.data?.data ?? patRes.data ?? [];
      const paidList = paidRes.data?.data ?? paidRes.data ?? [];
      const unpaidList = unpaidRes.data?.data ?? unpaidRes.data ?? [];
      setAppointments(Array.isArray(aptData) ? aptData : []);
      setStats({
        appointments: Array.isArray(aptData) ? aptData.length : 0,
        patients: Array.isArray(patData) ? patData.length : 0,
        revenue: Array.isArray(paidList) ? paidList.reduce((s: number, i: { total?: number }) => s + (i.total ?? 0), 0) : 0,
        pending: Array.isArray(unpaidList) ? unpaidList.length : 0,
      });
    }).catch(() => setStats({ appointments: 0, patients: 0, revenue: 0, pending: 0 })).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-slate-500">Today</p><p className="text-2xl font-semibold">{stats.appointments}</p></div>
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-slate-500">Patients</p><p className="text-2xl font-semibold">{stats.patients}</p></div>
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-slate-500">Revenue</p><p className="text-2xl font-semibold">ETB {stats.revenue.toFixed(2)}</p></div>
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-semibold">{stats.pending}</p></div>
      </div>
      <div className="mt-8 rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-lg font-semibold">Today Appointments</h2>
        {appointments.length === 0 ? <p className="text-slate-500">No appointments</p> : (
          <table className="w-full"><thead><tr className="border-b"><th className="pb-2 text-left">Patient</th><th className="pb-2 text-left">Doctor</th><th className="pb-2 text-left">Time</th></tr></thead>
          <tbody>{(appointments as { id: number; patient?: { full_name?: string }; doctor?: { name?: string }; timeslot?: string }[]).map((a) => <tr key={a.id} className="border-b"><td className="py-2">{a.patient?.full_name ?? '-'}</td><td className="py-2">{a.doctor?.name ?? '-'}</td><td className="py-2">{a.timeslot ?? '-'}</td></tr>)}</tbody></table>
        )}
      </div>
    </div>
  );
}
