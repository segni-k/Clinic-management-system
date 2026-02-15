import { useEffect, useState } from 'react';
import { visitsApi } from '../api/services';

export default function Visits() {
  const [visits, setVisits] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitsApi.list().then((r) => { const d = r.data?.data ?? r.data; setVisits(Array.isArray(d) ? d : []); }).catch(() => setVisits([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Visits</h1>
      <div className="rounded-lg bg-white shadow">
        {loading ? <p className="p-4">Loading...</p> : (
          <table className="w-full">
            <thead><tr className="border-b bg-slate-50"><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Doctor</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Diagnosis</th></tr></thead>
            <tbody>
              {(visits as { id: number; patient?: { full_name?: string }; doctor?: { name?: string }; visit_date?: string; diagnosis?: string }[]).map((v) => (
                <tr key={v.id} className="border-b"><td className="px-4 py-3">{v.patient?.full_name ?? '-'}</td><td className="px-4 py-3">{v.doctor?.name ?? '-'}</td><td className="px-4 py-3">{v.visit_date ? new Date(v.visit_date).toLocaleString() : '-'}</td><td className="px-4 py-3">{v.diagnosis ?? '-'}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
