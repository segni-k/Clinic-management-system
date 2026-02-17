import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { visitsApi, patientsApi, prescriptionsApi, invoicesApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Card, { CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Icons } from '../components/Icons';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

export default function VisitForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointment_id');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [visitForm, setVisitForm] = useState({
    patient_id: '',
    appointment_id: appointmentId || '',
    visit_date: new Date().toISOString().slice(0, 16),
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    consultation_fee: '',
    additional_charges: '',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  const [includePrescription, setIncludePrescription] = useState(false);
  const [generateInvoice, setGenerateInvoice] = useState(true);

  useEffect(() => {
    // Check if user is doctor
    if (user?.role?.slug !== 'doctor') {
      alert('Only doctors can create visits');
      navigate('/appointments');
      return;
    }

    patientsApi
      .list()
      .then((r) => {
        const d = r.data?.data ?? r.data;
        setPatients(Array.isArray(d) ? d : []);
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // 1. Create visit
      const visitData = {
        ...visitForm,
        patient_id: Number(visitForm.patient_id),
        appointment_id: visitForm.appointment_id ? Number(visitForm.appointment_id) : null,
      };
      
      const visitResponse = await visitsApi.create(visitData);
      const visitId = visitResponse.data?.id || visitResponse.data?.data?.id;

      // 2. Create prescription if included
      if (includePrescription && prescriptionForm.medication) {
        await prescriptionsApi.create({
          visit_id: visitId,
          patient_id: Number(visitForm.patient_id),
          ...prescriptionForm,
        });
      }

      // 3. Generate invoice if requested
      if (generateInvoice && (invoiceForm.consultation_fee || invoiceForm.additional_charges)) {
        const consultationFee = parseFloat(invoiceForm.consultation_fee) || 0;
        const additionalCharges = parseFloat(invoiceForm.additional_charges) || 0;
        const total = consultationFee + additionalCharges;

        if (total > 0) {
          await invoicesApi.create({
            patient_id: Number(visitForm.patient_id),
            visit_id: visitId,
            total,
            payment_status: 'unpaid',
            issue_date: new Date().toISOString().slice(0, 10),
            due_date: invoiceForm.due_date,
          });
        }
      }

      navigate('/visits');
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
        ?.response?.data;
      setError(
        data?.message ??
          (data?.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to create visit')
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading form..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Record Clinical Visit</h1>
        <p className="mt-1 text-sm text-gray-600">
          Document patient visit, add prescription, and generate invoice
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Visit Details */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Icons.Clipboard />
              Visit Information
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={visitForm.patient_id}
                  onChange={(e) => setVisitForm({ ...visitForm, patient_id: e.target.value })}
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

              <Input
                type="datetime-local"
                label="Visit Date & Time"
                required
                value={visitForm.visit_date}
                onChange={(e) => setVisitForm({ ...visitForm, visit_date: e.target.value })}
              />

              <div className="md:col-span-2">
                <Input
                  label="Symptoms"
                  required
                  value={visitForm.symptoms}
                  onChange={(e) => setVisitForm({ ...visitForm, symptoms: e.target.value })}
                  placeholder="Patient's reported symptoms"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Diagnosis"
                  required
                  value={visitForm.diagnosis}
                  onChange={(e) => setVisitForm({ ...visitForm, diagnosis: e.target.value })}
                  placeholder="Medical diagnosis"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Plan
                </label>
                <textarea
                  value={visitForm.treatment}
                  onChange={(e) => setVisitForm({ ...visitForm, treatment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Recommended treatment and procedures"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={2}
                  placeholder="Any additional observations or notes"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Prescription */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Prescription (Optional)</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePrescription}
                  onChange={(e) => setIncludePrescription(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Add Prescription</span>
              </label>
            </div>
          </CardHeader>
          {includePrescription && (
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Medication"
                  value={prescriptionForm.medication}
                  onChange={(e) =>
                    setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })
                  }
                  placeholder="Medication name"
                />

                <Input
                  label="Dosage"
                  value={prescriptionForm.dosage}
                  onChange={(e) =>
                    setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })
                  }
                  placeholder="e.g., 500mg"
                />

                <Input
                  label="Frequency"
                  value={prescriptionForm.frequency}
                  onChange={(e) =>
                    setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })
                  }
                  placeholder="e.g., Twice daily"
                />

                <Input
                  label="Duration"
                  value={prescriptionForm.duration}
                  onChange={(e) =>
                    setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })
                  }
                  placeholder="e.g., 7 days"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <textarea
                    value={prescriptionForm.instructions}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={2}
                    placeholder="Special instructions for taking medication"
                  />
                </div>
              </div>
            </CardBody>
          )}
        </Card>

        {/* Invoice */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Generate Invoice</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateInvoice}
                  onChange={(e) => setGenerateInvoice(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Create Invoice</span>
              </label>
            </div>
          </CardHeader>
          {generateInvoice && (
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  type="number"
                  label="Consultation Fee (ETB)"
                  value={invoiceForm.consultation_fee}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, consultation_fee: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />

                <Input
                  type="number"
                  label="Additional Charges (ETB)"
                  value={invoiceForm.additional_charges}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, additional_charges: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />

                <Input
                  type="date"
                  label="Payment Due Date"
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                />

                <div className="flex items-end">
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-700 mb-1">Total Amount</p>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-lg font-semibold text-emerald-600">
                      ETB{' '}
                      {(
                        (parseFloat(invoiceForm.consultation_fee) || 0) +
                        (parseFloat(invoiceForm.additional_charges) || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          )}
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" loading={saving} size="lg">
            <Icons.Check />
            <span className="ml-2">Save Visit</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/visits')} size="lg">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
