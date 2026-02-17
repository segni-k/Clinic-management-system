import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitsApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { DataTable } from '../components/DataTable';
import Button from '../components/Button';
import { Icons } from '../components/Icons';

interface Visit {
  [key: string]: unknown;
  id: number;
  patient?: { full_name?: string };
  doctor?: { name?: string };
  visit_date?: string;
  diagnosis?: string;
  symptoms?: string;
}

export default function Visits() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const isDoctor = user?.role?.slug === 'doctor';

  useEffect(() => {
    visitsApi
      .list()
      .then((r) => {
        const d = r.data?.data ?? r.data;
        setVisits(Array.isArray(d) ? d : []);
      })
      .catch(() => setVisits([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinical Visits</h1>
          <p className="mt-1 text-sm text-gray-600">Patient visit records and medical consultations</p>
        </div>
        {isDoctor && (
          <Button onClick={() => navigate('/visits/new')} className="w-full sm:w-auto">
            <Icons.Plus />
            <span className="ml-2">New Visit</span>
          </Button>
        )}
      </div>

      {/* Visits Table */}
      <DataTable<Visit>
        data={visits}
        loading={loading}
        searchable
        searchPlaceholder="Search visits..."
        emptyMessage="No clinical visits recorded"
        columns={[
          {
            key: 'patient',
            label: 'Patient',
            sortable: true,
            render: (v) => v.patient?.full_name || '-',
          },
          {
            key: 'doctor',
            label: 'Doctor',
            sortable: true,
            render: (v) => v.doctor?.name || '-',
          },
          {
            key: 'visit_date',
            label: 'Visit Date',
            sortable: true,
            render: (v) =>
              v.visit_date
                ? new Date(v.visit_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-',
          },
          { key: 'symptoms', label: 'Symptoms' },
          { key: 'diagnosis', label: 'Diagnosis' },
        ]}
      />
    </div>
  );
}
