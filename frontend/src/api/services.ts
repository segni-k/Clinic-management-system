import { api } from './axios';

export const authApi = {
  login: (email: string, password: string) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  user: () => api.get('/user'),
};

export const patientsApi = {
  list: (params?: { per_page?: number }) => api.get('/patients', { params }),
  get: (id: number) => api.get(`/patients/${id}`),
  create: (data: Record<string, unknown>) => api.post('/patients', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/patients/${id}`, data),
  delete: (id: number) => api.delete(`/patients/${id}`),
  search: (q: string) => api.get('/patients/search', { params: { q } }),
};

export const doctorsApi = {
  list: () => api.get('/doctors'),
  get: (id: number) => api.get(`/doctors/${id}`),
  create: (data: Record<string, unknown>) => api.post('/doctors', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/doctors/${id}`, data),
  delete: (id: number) => api.delete(`/doctors/${id}`),
  search: (q: string) => api.get('/doctors/search', { params: { q } }),
};

export const appointmentsApi = {
  list: (params?: { date?: string; status?: string; per_page?: number }) => api.get('/appointments', { params }),
  create: (data: Record<string, unknown>) => api.post('/appointments', data),
  get: (id: number) => api.get(`/appointments/${id}`),
  updateStatus: (id: number, status: string) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};

export const visitsApi = {
  list: (params?: { per_page?: number }) => api.get('/visits', { params }),
  fromAppointment: (appointmentId: number) => api.post(`/visits/from-appointment/${appointmentId}`),
  get: (id: number) => api.get(`/visits/${id}`),
  create: (data: Record<string, unknown>) => api.post('/visits', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/visits/${id}`, data),
  delete: (id: number) => api.delete(`/visits/${id}`),
};

export const prescriptionsApi = {
  list: (params?: { patient_id?: number; visit_id?: number; status?: string; per_page?: number }) => api.get('/prescriptions', { params }),
  get: (id: number) => api.get(`/prescriptions/${id}`),
  create: (data: Record<string, unknown>) => api.post('/prescriptions', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/prescriptions/${id}`, data),
  delete: (id: number) => api.delete(`/prescriptions/${id}`),
  downloadPdf: (id: number) => api.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' }),
};

export const invoicesApi = {
  list: (params?: { payment_status?: string; per_page?: number }) => api.get('/invoices', { params }),
  get: (id: number) => api.get(`/invoices/${id}`),
  create: (data: Record<string, unknown>) => api.post('/invoices', data),
  pay: (id: number, payment_method: string) => api.patch(`/invoices/${id}/pay`, { payment_method }),
  delete: (id: number) => api.delete(`/invoices/${id}`),
  downloadPdf: (id: number) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
};
