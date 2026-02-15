import { useEffect, useState } from 'react';
import { invoicesApi } from '../api/services';

export default function Invoices() {
  const [invoices, setInvoices] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoicesApi.list().then((r) => { const d = r.data?.data ?? r.data; setInvoices(Array.isArray(d) ? d : []); }).catch(() => setInvoices([])).finally(() => setLoading(false));
  }, []);

  const handlePay = async (id: number) => {
    try {
      await invoicesApi.pay(id, 'cash');
      const r = await invoicesApi.list();
      const d = r.data?.data ?? r.data;
      setInvoices(Array.isArray(d) ? d : []);
    } catch {
      // Error already shown by axios interceptor or could add toast
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Invoices</h1>
      <div className="rounded-lg bg-white shadow">
        {loading ? <p className="p-4">Loading...</p> : (
          <table className="w-full">
            <thead><tr className="border-b bg-slate-50"><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
            <tbody>
              {(invoices as { id: number; patient?: { full_name?: string }; total?: number; payment_status?: string }[]).map((inv) => (
                <tr key={inv.id} className="border-b">
                  <td className="px-4 py-3">{inv.patient?.full_name ?? '-'}</td>
                  <td className="px-4 py-3">ETB {inv.total?.toFixed(2) ?? '0'}</td>
                  <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-sm ${inv.payment_status === 'paid' ? 'bg-green-100' : 'bg-amber-100'}`}>{inv.payment_status}</span></td>
                  <td className="px-4 py-3">{inv.payment_status === 'unpaid' && <button onClick={() => handlePay(inv.id)} className="text-emerald-600">Mark Paid</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
