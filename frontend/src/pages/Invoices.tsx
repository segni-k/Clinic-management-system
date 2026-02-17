import { useEffect, useState } from 'react';
import { invoicesApi } from '../api/services';
import { useToast } from '../context/ToastContext';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import Button from '../components/Button';
import { Icons } from '../components/Icons';

interface Invoice {
  [key: string]: unknown;
  id: number;
  patient?: { full_name?: string };
  total?: number;
  payment_status?: string;
  issue_date?: string;
  due_date?: string;
}

export default function Invoices() {
  const { success, error: showError } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<number | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setLoading(true);
    invoicesApi
      .list()
      .then((r) => {
        const d = r.data?.data ?? r.data;
        setInvoices(Array.isArray(d) ? d : []);
      })
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  };

  const handlePay = async (id: number) => {
    setPaying(id);
    try {
      await invoicesApi.pay(id, 'cash');
      success('Invoice marked as paid successfully!');
      loadInvoices();
    } catch {
      showError('Failed to mark invoice as paid');
    } finally {
      setPaying(null);
    }
  };

  const handleDownloadPdf = async (id: number) => {
    try {
      const response = await invoicesApi.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      success('Invoice PDF downloaded successfully!');
    } catch {
      showError('Failed to download invoice PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoices & Billing</h1>
        <p className="mt-1 text-sm text-gray-600">Manage patient invoices and payments</p>
      </div>

      {/* Invoices Table */}
      <DataTable<Invoice>
        data={invoices}
        loading={loading}
        searchable
        searchPlaceholder="Search invoices..."
        emptyMessage="No invoices found"
        columns={[
          {
            key: 'patient',
            label: 'Patient',
            sortable: true,
            render: (inv) => inv.patient?.full_name || '-',
          },
          {
            key: 'issue_date',
            label: 'Issue Date',
            sortable: true,
            render: (inv) =>
              inv.issue_date
                ? new Date(inv.issue_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '-',
          },
          {
            key: 'due_date',
            label: 'Due Date',
            sortable: true,
            render: (inv) =>
              inv.due_date
                ? new Date(inv.due_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '-',
          },
          {
            key: 'total',
            label: 'Amount',
            sortable: true,
            render: (inv) =>
              `ETB ${inv.total?.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || '0.00'}`,
          },
          {
            key: 'payment_status',
            label: 'Status',
            render: (inv) => <StatusBadge status={inv.payment_status || 'pending'} type="invoice" />,
          },
        ]}
        actions={(inv) => (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadPdf(inv.id)}
            >
              <Icons.Download />
              <span className="ml-1">PDF</span>
            </Button>
            {inv.payment_status === 'unpaid' && (
              <Button
                size="sm"
                onClick={() => handlePay(inv.id)}
                loading={paying === inv.id}
                variant="success"
              >
                <Icons.Check />
                <span className="ml-1">Mark Paid</span>
              </Button>
            )}
          </>
        )}
      />
    </div>
  );
}
