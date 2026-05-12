import api from './axiosInstance';

export const loginCall = async (email, password) => {
  const response = await api.post(`/auth/login`, { email, password });
  return response.data;
};

export const registerCall = async (username, email, password) => {
  const response = await api.post(`/auth/register`, { username, email, password });
  return response.data;
};

export const logoutCall = async () => {
  const response = await api.post(`/auth/logout`);
  return response.data;
};
