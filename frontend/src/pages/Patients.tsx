import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientsApi } from '../api/services';
import Card from '../components/Card';
import Button from '../components/Button';
import { DataTable } from '../components/DataTable';
import { Icons } from '../components/Icons';

interface Patient {
  [key: string]: unknown;
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    patientsApi
      .list()
      .then((r) => {
        const d = r.data?.data ?? r.data;
        setPatients(Array.isArray(d) ? d : []);
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-600">Manage patient records and information</p>
        </div>
        <Button onClick={() => navigate('/patients/new')} className="w-full sm:w-auto">
          <Icons.Plus />
          <span className="ml-2">Add Patient</span>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <DataTable<Patient>
          data={patients}
          loading={loading}
          searchable
          searchPlaceholder="Search by name, phone, or email..."
          onRowClick={(patient) => navigate(`/patients/${patient.id}`)}
          emptyMessage="No patients found. Get started by adding your first patient."
          columns={[
            {
              key: 'first_name',
              label: 'Name',
              sortable: true,
              render: (p) => `${p.first_name} ${p.last_name}`,
            },
            { key: 'phone', label: 'Phone', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            {
              key: 'gender',
              label: 'Gender',
              sortable: true,
              render: (p) => <span className="capitalize">{p.gender || '-'}</span>,
            },
            {
              key: 'date_of_birth',
              label: 'Date of Birth',
              sortable: true,
              render: (p) =>
                p.date_of_birth
                  ? new Date(p.date_of_birth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-',
            },
          ]}
          actions={(patient) => (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              <Icons.Eye />
              <span className="ml-1">View</span>
            </Button>
          )}
        />
      </Card>

      {/* Results count */}
      {!loading && patients.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {patients.length} patient{patients.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
