import { useEffect, useState } from 'react';
import { appointmentsApi, doctorsApi, patientsApi, visitsApi } from '../api/services';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  [key: string]: unknown;
  id: number;
  patient?: { full_name?: string; id?: number };
  doctor?: { name?: string; id?: number };
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
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState<number | null>(null);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    timeslot: '09:00-10:00',
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
      success('Appointment created successfully!');
      setShowForm(false);
      setForm({ patient_id: '', doctor_id: '', appointment_date: '', timeslot: '09:00-10:00' });
      loadAppointments();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
        ?.response?.data;
      const errorMessage =
        data?.message ??
          (data?.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to create appointment');
      setFormError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToVisit = async (appointmentId: number) => {
    setConverting(appointmentId);
    try {
      await visitsApi.fromAppointment(appointmentId);
      await appointmentsApi.updateStatus(appointmentId, 'completed');
      success('Appointment converted to visit successfully!');
      loadAppointments();
    } catch (err) {
      showError('Failed to convert appointment to visit');
    } finally {
      setConverting(null);
    }
  };

  const isDoctor = user?.role?.slug === 'doctor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-600">Schedule and manage patient appointments</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Icons.Plus />
          <span className="ml-2">New Appointment</span>
        </Button>
      </div>

      {/* Appointments Table */}
      <DataTable<Appointment>
        data={appointments}
        loading={loading}
        searchable
        searchPlaceholder="Search appointments..."
        emptyMessage="No appointments scheduled. Get started by creating your first appointment."
        columns={[
          {
            key: 'patient',
            label: 'Patient',
            sortable: true,
            render: (apt) => apt.patient?.full_name || '-',
          },
          {
            key: 'doctor',
            label: 'Doctor',
            sortable: true,
            render: (apt) => apt.doctor?.name || '-',
          },
          {
            key: 'appointment_date',
            label: 'Date',
            sortable: true,
            render: (apt) =>
              apt.appointment_date
                ? new Date(apt.appointment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '-',
          },
          { key: 'timeslot', label: 'Time', sortable: true },
          {
            key: 'status',
            label: 'Status',
            render: (apt) => <StatusBadge status={apt.status || 'scheduled'} type="appointment" />,
          },
        ]}
        actions={(apt) => (
          <>
            {isDoctor && apt.status === 'scheduled' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleConvertToVisit(apt.id)}
                loading={converting === apt.id}
              >
                <Icons.Check />
                <span className="ml-1">Convert to Visit</span>
              </Button>
            )}
          </>
        )}
      />

      {/* Create Appointment Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Schedule New Appointment"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={saving}>
              Save Appointment
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{formError}</p>
            </div>
          )}

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
        </form>
      </Modal>
    </div>
  );
}
