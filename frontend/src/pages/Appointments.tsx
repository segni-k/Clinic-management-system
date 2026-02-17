import { useEffect, useState } from 'react';
import { appointmentsApi, doctorsApi, patientsApi } from '../api/services';
import Card, { CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import Badge from '../components/Badge';
import { Icons } from '../components/Icons';

interface Appointment {
  id: number;
  patient?: { full_name?: string };
  doctor?: { name?: string };
  appointment_date?: string;
  timeslot?: string;
  status?: string;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

interface Doctor {
  id: number;
  name: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    timeslot: '09:00',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadAppointments();
    loadPatientsAndDoctors();
  }, []);

  const loadAppointments = () => {
    setLoading(true);
    appointmentsApi
      .list()
      .then((r) => {
        const d = r.data?.data ?? r.data;
        setAppointments(Array.isArray(d) ? d : []);
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  const loadPatientsAndDoctors = () => {
    patientsApi.list().then((r) => {
      const d = r.data?.data ?? r.data;
      setPatients(Array.isArray(d) ? d : []);
    });
    doctorsApi.list().then((r) => {
      const d = r.data?.data ?? r.data;
      setDoctors(Array.isArray(d) ? d : []);
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    
    try {
      await appointmentsApi.create({
        ...form,
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
      });
      setShowForm(false);
      setForm({ patient_id: '', doctor_id: '', appointment_date: '', timeslot: '09:00' });
      loadAppointments();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
        ?.response?.data;
      setFormError(
        data?.message ??
          (data?.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to create appointment')
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'no_show':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-600">Schedule and manage patient appointments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
          <Icons.Plus />
          <span className="ml-2">New Appointment</span>
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Schedule Appointment</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleCreate} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.patient_id}
                    onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.doctor_id}
                    onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="date"
                  label="Appointment Date"
                  required
                  value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                />

                <Input
                  type="text"
                  label="Time Slot"
                  required
                  placeholder="e.g., 09:00-10:00"
                  value={form.timeslot}
                  onChange={(e) => setForm({ ...form, timeslot: e.target.value })}
                  helperText="Format: HH:MM-HH:MM"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" loading={saving}>
                  Save Appointment
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Appointments Table */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Icons.Calendar />
              <p className="mt-4 text-lg font-medium text-gray-900">No appointments scheduled</p>
              <p className="mt-2 text-sm text-gray-600">Get started by scheduling your first appointment</p>
              <Button onClick={() => setShowForm(true)} className="mt-6">
                <Icons.Plus />
                <span className="ml-2">New Appointment</span>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
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
                    <TableCell>
                      {appointment.appointment_date
                        ? new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>{appointment.timeslot || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {appointment.status || 'scheduled'}
                      </Badge>
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
