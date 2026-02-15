import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientsApi } from '../api/services';

export default function PatientForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', gender: '', date_of_birth: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await patientsApi.create(form);
      navigate('/patients');
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      setError(data?.message ?? (data?.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to create patient'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Register Patient</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-lg bg-white p-6 shadow">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2" rows={3} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50">Save</button>
      </form>
    </div>
  );
}
