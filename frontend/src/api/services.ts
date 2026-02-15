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
  search: (q: string) => api.get('/patients/search', { params: { q } }),
};

export const doctorsApi = {
  list: () => api.get('/doctors'),
};

export const appointmentsApi = {
  list: (params?: { date?: string; status?: string }) => api.get('/appointments', { params }),
  create: (data: Record<string, unknown>) => api.post('/appointments', data),
  get: (id: number) => api.get(`/appointments/${id}`),
  updateStatus: (id: number, status: string) => api.patch(`/appointments/${id}/status`, { status }),
};

export const visitsApi = {
  list: () => api.get('/visits'),
  fromAppointment: (appointmentId: number) => api.post(`/visits/from-appointment/${appointmentId}`),
  get: (id: number) => api.get(`/visits/${id}`),
  update: (id: number, data: Record<string, unknown>) => api.put(`/visits/${id}`, data),
};

export const invoicesApi = {
  list: (params?: { payment_status?: string }) => api.get('/invoices', { params }),
  get: (id: number) => api.get(`/invoices/${id}`),
  create: (data: Record<string, unknown>) => api.post('/invoices', data),
  pay: (id: number, payment_method: string) => api.patch(`/invoices/${id}/pay`, { payment_method }),
};
