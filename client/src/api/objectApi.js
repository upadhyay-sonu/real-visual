import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/objects` 
  : '/api/objects';

// Setup axios instance with auth header
const createAuthInstance = () => {
  const token = getToken();
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const uploadObjectCall = async (file, onUploadProgress) => {
  const instance = createAuthInstance();
  const formData = new FormData();
  formData.append('modelFile', file);

  const response = await instance.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
  return response.data;
};

export const getObjectsCall = async () => {
  const instance = createAuthInstance();
  const response = await instance.get(API_URL);
  return response.data;
};

export const getObjectByIdCall = async (id) => {
  const instance = createAuthInstance();
  const response = await instance.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateCameraStateCall = async (id, position, target) => {
  const instance = createAuthInstance();
  const response = await instance.put(`${API_URL}/${id}/camera`, { position, target });
  return response.data;
};

export const deleteObjectCall = async (id) => {
  const instance = createAuthInstance();
  const response = await instance.delete(`${API_URL}/${id}`);
  return response.data;
};
