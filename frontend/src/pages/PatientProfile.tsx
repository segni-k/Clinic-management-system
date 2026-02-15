import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { patientsApi } from '../api/services';

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'visits' | 'prescriptions' | 'invoices'>('visits');

  useEffect(() => {
    if (id) {
      patientsApi.get(Number(id)).then((res) => setPatient(res.data)).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !patient) return <div className="text-slate-500">Loading...</div>;

  const visits = (patient.visits ?? []) as Record<string, unknown>[];
  const prescriptions = (patient.prescriptions ?? []) as unknown[];
  const invoices = (patient.invoices ?? []) as Record<string, unknown>[];
  const p = patient as Record<string, unknown>;

  return (
    <div>
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">{String(p.first_name ?? '')} {String(p.last_name ?? '')}</h1>
        <p className="text-slate-500">{String(p.phone ?? '')}</p>
        <p>{String(p.gender ?? '')} · {p.date_of_birth ? new Date(p.date_of_birth as string).toLocaleDateString() : '-'}</p>
        <p className="mt-2 text-sm">{String(p.address ?? '-')}</p>
      </div>
      <div className="flex gap-2 border-b">
        {(['visits', 'prescriptions', 'invoices'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 capitalize ${tab === t ? 'border-emerald-600 text-emerald-600' : 'border-transparent'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-white p-4 shadow">
        {tab === 'visits' && (
          <div>
            {visits.length === 0 ? <p className="text-slate-500">No visits</p> : (
              visits.map((v: Record<string, unknown>) => (
                <div key={v.id as number} className="border-b py-3 last:border-0">
                  <p className="font-medium">{v.visit_date ? new Date(v.visit_date as string).toLocaleString() : '-'}</p>
                  <p className="text-sm text-slate-500">Diagnosis: {String(v.diagnosis ?? '-')}</p>
                </div>
              ))
            )}
          </div>
        )}
        {tab === 'prescriptions' && (
          <div>
            {prescriptions.length === 0 ? <p className="text-slate-500">No prescriptions</p> : (
              <pre className="text-sm">{JSON.stringify(prescriptions, null, 2)}</pre>
            )}
          </div>
        )}
        {tab === 'invoices' && (
          <div>
            {invoices.length === 0 ? <p className="text-slate-500">No invoices</p> : (
              invoices.map((inv: Record<string, unknown>) => (
                <div key={inv.id as number} className="flex justify-between border-b py-3">
                  <span>ETB {(inv.total as number)?.toFixed(2) ?? 0}</span>
                  <span className={`rounded px-2 py-0.5 text-sm ${inv.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {String(inv.payment_status)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
