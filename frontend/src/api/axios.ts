import axios from 'axios';

const normalizeApiBaseUrl = (rawBase?: string) => {
  const fallback = 'http://localhost:8000/api';

  if (!rawBase) {
    return fallback;
  }

  const trimmedBase = rawBase.trim().replace(/\/+$/, '');
  return trimmedBase.endsWith('/api') ? trimmedBase : `${trimmedBase}/api`;
};

const API_BASE = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
