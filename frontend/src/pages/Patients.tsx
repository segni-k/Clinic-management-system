import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patientsApi } from '../api/services';

export default function Patients() {
  const [patients, setPatients] = useState<{ id: number; first_name: string; last_name: string; phone: string }[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (search.length >= 2) {
      patientsApi.search(search).then((r) => { const d = r.data?.data ?? r.data; setPatients(Array.isArray(d) ? d : []); }).catch(() => setPatients([])).finally(() => setLoading(false));
    } else {
      patientsApi.list().then((r) => { const d = r.data?.data ?? r.data; setPatients(Array.isArray(d) ? d : []); }).catch(() => setPatients([])).finally(() => setLoading(false));
    }
  }, [search]);

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Link to="/patients/new" className="rounded bg-emerald-600 px-4 py-2 text-white">Add Patient</Link>
      </div>
      <input type="text" placeholder="Search by name or phone" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-md rounded border px-3 py-2" />
      <div className="rounded-lg bg-white shadow">
        {loading ? <p className="p-4">Loading...</p> : (
          <table className="w-full">
            <thead><tr className="border-b bg-slate-50"><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3">{p.first_name} {p.last_name}</td>
                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3"><Link to={`/patients/${p.id}`} className="text-emerald-600">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
