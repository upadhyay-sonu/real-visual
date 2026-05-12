import apiClient from './apiClient';

export const uploadObjectCall = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('modelFile', file);

  const response = await apiClient.post(`/objects/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
  return response.data;
};

export const getObjectsCall = async () => {
  const response = await apiClient.get(`/objects`);
  return response.data;
};

export const getObjectByIdCall = async (id) => {
  const response = await apiClient.get(`/objects/${id}`);
  return response.data;
};

export const updateCameraStateCall = async (id, position, target) => {
  const response = await apiClient.put(`/objects/${id}/camera`, { position, target });
  return response.data;
};

export const deleteObjectCall = async (id) => {
  const response = await apiClient.delete(`/objects/${id}`);
  return response.data;
};
