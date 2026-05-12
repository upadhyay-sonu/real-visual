import axios from "axios";
import API_BASE_URL from "../config/api";
import { getToken } from "../utils/tokenStorage";
import { parseApiError } from "../utils/errorParser";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to auto-attach token for protected routes
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for centralized API error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Parse the error into a clean string so UI components never see the raw Axios object
    const cleanErrorMessage = parseApiError(error);
    if (process.env.NODE_ENV !== 'production') {
      console.error("API Call Failed:", cleanErrorMessage);
    }
    return Promise.reject(cleanErrorMessage);
  }
);

export default api;
