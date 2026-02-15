import { useEffect, useState } from 'react';
import { appointmentsApi, doctorsApi, patientsApi } from '../api/services';

export default function Appointments() {
  const [appointments, setAppointments] = useState<unknown[]>([]);
  const [patients, setPatients] = useState<{ id: number; first_name: string; last_name: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', appointment_date: '', timeslot: '09:00' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    appointmentsApi.list().then((r) => { const d = r.data?.data ?? r.data; setAppointments(Array.isArray(d) ? d : []); }).catch(() => setAppointments([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    patientsApi.list().then((r) => { const d = r.data?.data ?? r.data; setPatients(Array.isArray(d) ? d : []); });
    doctorsApi.list().then((r) => { const d = r.data?.data ?? r.data; setDoctors(Array.isArray(d) ? d : []); });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      await appointmentsApi.create({ ...form, patient_id: Number(form.patient_id), doctor_id: Number(form.doctor_id) });
      setShowForm(false);
      setForm({ patient_id: '', doctor_id: '', appointment_date: '', timeslot: '09:00' });
      const r = await appointmentsApi.list();
      const d = r.data?.data ?? r.data;
      setAppointments(Array.isArray(d) ? d : []);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      setFormError(data?.message ?? (data?.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to create appointment'));
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button onClick={() => setShowForm(true)} className="rounded bg-emerald-600 px-4 py-2 text-white">Create</button>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 max-w-md space-y-2 rounded bg-white p-4 shadow">
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <select required value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} className="w-full rounded border px-3 py-2">
            <option value="">Patient</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </select>
          <select required value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })} className="w-full rounded border px-3 py-2">
            <option value="">Doctor</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input type="date" required value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} className="w-full rounded border px-3 py-2" />
          <input type="text" value={form.timeslot} onChange={(e) => setForm({ ...form, timeslot: e.target.value })} className="w-full rounded border px-3 py-2" />
          <div className="flex gap-2"><button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white">Save</button><button type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
        </form>
      )}
      <div className="rounded-lg bg-white shadow">
        {loading ? <p className="p-4">Loading...</p> : (
          <table className="w-full">
            <thead><tr className="border-b bg-slate-50"><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Doctor</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
            <tbody>{(appointments as { id: number; patient?: { full_name?: string }; doctor?: { name?: string }; appointment_date?: string; status?: string }[]).map((a) => <tr key={a.id} className="border-b"><td className="px-4 py-3">{a.patient?.full_name ?? '-'}</td><td className="px-4 py-3">{a.doctor?.name ?? '-'}</td><td className="px-4 py-3">{a.appointment_date ?? '-'}</td><td className="px-4 py-3">{a.status ?? '-'}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
