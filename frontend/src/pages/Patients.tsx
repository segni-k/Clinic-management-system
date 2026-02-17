import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientsApi } from '../api/services';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import { Icons } from '../components/Icons';

interface Patient {
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
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (search.length >= 2) {
      patientsApi
        .search(search)
        .then((r) => {
          const d = r.data?.data ?? r.data;
          setPatients(Array.isArray(d) ? d : []);
        })
        .catch(() => setPatients([]))
        .finally(() => setLoading(false));
    } else {
      patientsApi
        .list()
        .then((r) => {
          const d = r.data?.data ?? r.data;
          setPatients(Array.isArray(d) ? d : []);
        })
        .catch(() => setPatients([]))
        .finally(() => setLoading(false));
    }
  }, [search]);

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

      {/* Search */}
      <Card>
        <CardBody>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <Input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading patients...</p>
              </div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <Icons.Patients />
              <p className="mt-4 text-lg font-medium text-gray-900">No patients found</p>
              <p className="mt-2 text-sm text-gray-600">
                {search ? 'Try adjusting your search criteria' : 'Get started by adding your first patient'}
              </p>
              {!search && (
                <Button onClick={() => navigate('/patients/new')} className="mt-6">
                  <Icons.Plus />
                  <span className="ml-2">Add Patient</span>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)}>
                    <TableCell className="font-medium">
                      {patient.first_name} {patient.last_name}
                    </TableCell>
                    <TableCell>{patient.phone || '-'}</TableCell>
                    <TableCell>{patient.email || '-'}</TableCell>
                    <TableCell className="capitalize">{patient.gender || '-'}</TableCell>
                    <TableCell>
                      {patient.date_of_birth
                        ? new Date(patient.date_of_birth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icons.Eye />
                        <span className="ml-1">View</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
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
