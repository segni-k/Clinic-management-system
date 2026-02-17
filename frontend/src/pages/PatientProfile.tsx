import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientsApi, prescriptionsApi, invoicesApi } from '../api/services';
import Card, { CardHeader, CardBody } from '../components/Card';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Button from '../components/Button';  
import { Icons } from '../components/Icons';

interface Visit {
  id: number;
  visit_date: string;
  doctor?: { name: string };
  diagnosis?: string;
  symptoms?: string;
}

interface Prescription {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  status?: string;
}

interface Invoice {
  id: number;
  total: number;
  payment_status: string;
  issue_date: string;
}

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'visits' | 'prescriptions' | 'invoices'>('visits');

  useEffect(() => {
    if (id) {
      patientsApi.get(Number(id)).then((res) => setPatient(res.data)).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen text="Loading patient profile..." />;
  if (!patient) return <div className="text-center py-12 text-red-600">Patient not found</div>;

  const visits = (patient.visits ?? []) as Visit[];
  const prescriptions = (patient.prescriptions ?? []) as Prescription[];
  const invoices = (patient.invoices ?? []) as Invoice[];
  const p = patient as Record<string, unknown>;

  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {String(p.first_name ?? '')} {String(p.last_name ?? '')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Patient ID: {id}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/appointments')}
            >
              <Icons.Calendar />
              <span className="ml-2">Book Appointment</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{String(p.phone ?? '-')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{String(p.email ?? '-')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium capitalize">{String(p.gender ?? '-')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium">
                {p.date_of_birth
                  ? new Date(p.date_of_birth as string).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '-'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{String(p.address ?? '-')}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {(['visits', 'prescriptions', 'invoices'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                tab === t
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {tab === 'visits' && (
        <Card>
          <DataTable<Visit>
            data={visits}
            loading={false}
            emptyMessage="No visits recorded for this patient"
            columns={[
              {
                key: 'visit_date',
                label: 'Visit Date',
                sortable: true,
                render: (v) =>
                  new Date(v.visit_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
              },
              {
                key: 'doctor',
                label: 'Doctor',
                render: (v) => v.doctor?.name || '-',
              },
              { key: 'symptoms', label: 'Symptoms' },
              { key: 'diagnosis', label: 'Diagnosis' },
            ]}
          />
        </Card>
      )}

      {tab === 'prescriptions' && (
        <Card>
          <DataTable<Prescription>
            data={prescriptions}
            loading={false}
            emptyMessage="No prescriptions for this patient"
            columns={[
              { key: 'medication', label: 'Medication', sortable: true },
              { key: 'dosage', label: 'Dosage' },
              { key: 'frequency', label: 'Frequency' },
              { key: 'duration', label: 'Duration' },
              {
                key: 'status',
                label: 'Status',
                render: (p) => <StatusBadge status={p.status || 'active'} type="prescription" />,
              },
            ]}
          />
        </Card>
      )}

      {tab === 'invoices' && (
        <Card>
          <DataTable<Invoice>
            data={invoices}
            loading={false}
            emptyMessage="No invoices for this patient"
            columns={[
              {
                key: 'issue_date',
                label: 'Issue Date',
                sortable: true,
                render: (inv) =>
                  new Date(inv.issue_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }),
              },
              {
                key: 'total',
                label: 'Amount',
                sortable: true,
                render: (inv) => `ETB ${inv.total.toFixed(2)}`,
              },
              {
                key: 'payment_status',
                label: 'Status',
                render: (inv) => <StatusBadge status={inv.payment_status} type="invoice" />,
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
