import axios from "axios";
import API_BASE_URL from "../config/api";
import { getToken } from "../utils/tokenStorage";

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
    console.error("Global API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
