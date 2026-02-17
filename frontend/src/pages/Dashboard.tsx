import { useEffect, useState } from 'react';
import { appointmentsApi, invoicesApi, patientsApi } from '../api/services';
import StatCard from '../components/StatCard';
import Card, { CardHeader, CardBody } from '../components/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Icons } from '../components/Icons';

interface Appointment {
  id: number;
  patient?: { full_name?: string };
  doctor?: { name?: string };
  timeslot?: string;
  status?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ appointments: 0, patients: 0, revenue: 0, pending: 0 });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    Promise.all([
      appointmentsApi.list({ date: today }),
      patientsApi.list(),
      invoicesApi.list({ payment_status: 'paid' }),
      invoicesApi.list({ payment_status: 'unpaid' }),
    ])
      .then(([aptRes, patRes, paidRes, unpaidRes]) => {
        const aptData = aptRes.data?.data ?? aptRes.data ?? [];
        const patData = patRes.data?.data ?? patRes.data ?? [];
        const paidList = paidRes.data?.data ?? paidRes.data ?? [];
        const unpaidList = unpaidRes.data?.data ?? unpaidRes.data ?? [];
        
        setAppointments(Array.isArray(aptData) ? aptData : []);
        setStats({
          appointments: Array.isArray(aptData) ? aptData.length : 0,
          patients: Array.isArray(patData) ? patData.length : 0,
          revenue: Array.isArray(paidList)
            ? paidList.reduce((s: number, i: { total?: number }) => s + (i.total ?? 0), 0)
            : 0,
          pending: Array.isArray(unpaidList) ? unpaidList.length : 0,
        });
      })
      .catch(() => setStats({ appointments: 0, patients: 0, revenue: 0, pending: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (<LoadingSpinner fullScreen text="Loading dashboard..." />);
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={stats.appointments}
          icon={<Icons.Calendar />}
          color="emerald"
        />
        <StatCard
          title="Total Patients"
          value={stats.patients}
          icon={<Icons.Patients />}
          color="blue"
        />
        <StatCard
          title="Revenue (This Month)"
          value={`ETB ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Icons.Chart />}
          color="purple"
        />
        <StatCard
          title="Pending Invoices"
          value={stats.pending}
          icon={<Icons.Document />}
          color="orange"
        />
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
            <Icons.Clock />
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Icons.Calendar />
              <p className="mt-2 text-gray-500">No appointments scheduled for today</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {appointment.patient?.full_name || '-'}
                    </TableCell>
                    <TableCell>{appointment.doctor?.name || '-'}</TableCell>
                    <TableCell>{appointment.timeslot || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={appointment.status || 'scheduled'} type="appointment" />
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
