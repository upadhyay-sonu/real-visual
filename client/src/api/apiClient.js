import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

// Base URL falls back to '/api' if the environment variable is not explicitly set.
// In production, VITE_API_URL must be exactly "https://real-visual.onrender.com/api"
const baseURL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT tokens to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
