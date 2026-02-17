import { useEffect, useState } from 'react';
import { visitsApi } from '../api/services';
import Card, { CardBody } from '../components/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import { Icons } from '../components/Icons';

interface Visit {
  id: number;
  patient?: { full_name?: string };
  doctor?: { name?: string };
  visit_date?: string;
  diagnosis?: string;
  symptoms?: string;
}

export default function Visits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinical Visits</h1>
        <p className="mt-1 text-sm text-gray-600">Patient visit records and medical consultations</p>
      </div>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading visits...</p>
              </div>
            </div>
          ) : visits.length === 0 ? (
            <div className="text-center py-12">
              <Icons.Clipboard />
              <p className="mt-4 text-lg font-medium text-gray-900">No visits recorded</p>
              <p className="mt-2 text-sm text-gray-600">Visit records will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Diagnosis</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">{visit.patient?.full_name || '-'}</TableCell>
                    <TableCell>{visit.doctor?.name || '-'}</TableCell>
                    <TableCell>
                      {visit.visit_date
                        ? new Date(visit.visit_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{visit.symptoms || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">{visit.diagnosis || '-'}</TableCell>
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
