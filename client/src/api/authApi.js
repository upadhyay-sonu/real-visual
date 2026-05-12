import api from './axiosInstance';

export const loginCall = async (email, password) => {
  try {
    const response = await api.post(`/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error.response?.data || error;
  }
};

export const registerCall = async (username, email, password) => {
  try {
    const response = await api.post(`/auth/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error("Register API Error:", error);
    throw error.response?.data || error;
  }
};

export const logoutCall = async () => {
  try {
    const response = await api.post(`/auth/logout`);
    return response.data;
  } catch (error) {
    console.error("Logout API Error:", error);
    throw error.response?.data || error;
  }
};
