import { api } from "./axios";

export const getContenedores = async (params = {}) => {
  const response = await api.get("/contenedores", { params });
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload?.data ?? [];
};

export const getContenedorById = async (id) => {
  const response = await api.get(`/contenedores/${id}`);
  return response.data;
};

export const createContenedor = async (payload) => {
  const response = await api.post("/contenedores", payload);
  return response.data;
};

export const updateContenedor = async (id, payload) => {
  const response = await api.put(`/contenedores/${id}`, payload);
  return response.data;
};

export const deleteContenedor = async (id) => {
  const response = await api.delete(`/contenedores/${id}`);
  return response.data;
};

export const restoreContenedor = async (id) => {
  const response = await api.patch(`/contenedores/${id}/restore`);
  return response.data;
};