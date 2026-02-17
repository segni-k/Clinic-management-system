import { useEffect, useState } from 'react';
import { invoicesApi } from '../api/services';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import Badge from '../components/Badge';
import { Icons } from '../components/Icons';

interface Invoice {
  id: number;
  patient?: { full_name?: string };
  total?: number;
  payment_status?: string;
  issue_date?: string;
  due_date?: string;
}

export default function Invoices() {
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
      loadInvoices();
    } catch {
      // Error already shown by axios interceptor or could add toast
    } finally {
      setPaying(null);
    }
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'overdue':
        return 'danger';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoices & Billing</h1>
        <p className="mt-1 text-sm text-gray-600">Manage patient invoices and payments</p>
      </div>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading invoices...</p>
              </div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <Icons.Document />
              <p className="mt-4 text-lg font-medium text-gray-900">No invoices found</p>
              <p className="mt-2 text-sm text-gray-600">Invoice records will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Patient</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.patient?.full_name || '-'}</TableCell>
                    <TableCell>
                      {invoice.issue_date
                        ? new Date(invoice.issue_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {invoice.due_date
                        ? new Date(invoice.due_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ETB {invoice.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.payment_status)}>
                        {invoice.payment_status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.payment_status === 'unpaid' && (
                        <Button
                          size="sm"
                          onClick={() => handlePay(invoice.id)}
                          loading={paying === invoice.id}
                          variant="success"
                        >
                          <Icons.Check />
                          <span className="ml-1">Mark Paid</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
