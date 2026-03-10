import { api } from "./axios";

export const getTiposMaterial = async (params = {}) => {
  const response = await api.get("/tipos-material", { params });
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload?.data ?? [];
};

export const getTipoMaterialById = async (id) => {
  const response = await api.get(`/tipos-material/${id}`);
  return response.data;
};

export const createTipoMaterial = async (payload) => {
  const response = await api.post("/tipos-material", payload);
  return response.data;
};

export const updateTipoMaterial = async (id, payload) => {
  const response = await api.put(`/tipos-material/${id}`, payload);
  return response.data;
};

export const deleteTipoMaterial = async (id) => {
  const response = await api.delete(`/tipos-material/${id}`);
  return response.data;
};

export const restoreTipoMaterial = async (id) => {
  const response = await api.patch(`/tipos-material/${id}/restore`);
  return response.data;
};