import axios from 'axios';

const API_URL = '/api/auth';

export const loginCall = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const registerCall = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password });
  return response.data;
};

export const logoutCall = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};
