import api from './axiosInstance';

export const uploadObjectCall = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('modelFile', file);

  const response = await api.post(`/objects/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
  return response.data;
};

export const getObjectsCall = async () => {
  const response = await api.get(`/objects`);
  return response.data;
};

export const getObjectByIdCall = async (id) => {
  const response = await api.get(`/objects/${id}`);
  return response.data;
};

export const updateCameraStateCall = async (id, position, target) => {
  const response = await api.put(`/objects/${id}/camera`, { position, target });
  return response.data;
};

export const deleteObjectCall = async (id) => {
  const response = await api.delete(`/objects/${id}`);
  return response.data;
};
