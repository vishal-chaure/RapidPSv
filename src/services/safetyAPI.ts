import axios from 'axios';
import type { Prediction, SearchResult, SafetyTips, GeoJSONCollection } from '../types/safety';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const safetyAPI = {
  getPredictions: async (hour: number): Promise<Prediction> => {
    try {
      const response = await api.get('/api/predict', {
        params: { hour }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  getWards: async (): Promise<GeoJSONCollection> => {
    try {
      const response = await api.get('/api/wards');
      return response.data;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  },

  searchLocation: async (query: string): Promise<SearchResult> => {
    try {
      const response = await api.get('/api/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching location:', error);
      throw error;
    }
  },

  getSafetyTips: async (wardId: string, hour?: number): Promise<SafetyTips> => {
    try {
      const params = hour !== undefined ? { hour } : {};
      const response = await api.get(`/api/tips/${wardId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching safety tips:', error);
      throw error;
    }
  },

  getHistoricalData: async (wardId: string, days = 7) => {
    try {
      const response = await api.get(`/api/historical/${wardId}`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  predictFutureRisk: async (wardId: string, hours = 24) => {
    try {
      const response = await api.get(`/api/future/${wardId}`, {
        params: { hours }
      });
      return response.data;
    } catch (error) {
      console.error('Error predicting future risk:', error);
      throw error;
    }
  }
};

export default safetyAPI;
