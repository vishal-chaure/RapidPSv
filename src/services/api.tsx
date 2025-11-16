// src/services/api.ts
import axios from 'axios';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const safetyAPI = {
  getPredictions: async (hour: number) => {
    const res = await api.get('/api/predict', { params: { hour } });
    return res.data;
  },

  getWards: async () => {
    const res = await api.get('/api/wards');
    return res.data;
  },

  searchLocation: async (query: string) => {
    const res = await api.get('/api/search', { params: { q: query } });
    return res.data;
  },

  getSafetyTips: async (wardId: string | number, hour?: number | null) => {
    const params = hour != null ? { hour } : {};
    const res = await api.get(`/api/tips/${wardId}`, { params });
    return res.data;
  },

  // ... other endpoints
};

export default safetyAPI;
