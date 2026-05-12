import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/auth` 
  : '/api/auth';

export const loginCall = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error.response?.data || error;
  }
};

export const registerCall = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error("Register API Error:", error);
    throw error.response?.data || error;
  }
};

export const logoutCall = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    console.error("Logout API Error:", error);
    throw error.response?.data || error;
  }
};
