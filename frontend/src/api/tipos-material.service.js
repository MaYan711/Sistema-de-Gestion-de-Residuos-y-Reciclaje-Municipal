import { api } from "./axios";

export const getTiposMaterial = async (params = {}) => {
  const { data } = await api.get("/tipos-material", { params });
  return data;
};

export const getTipoMaterialById = async (id) => {
  const { data } = await api.get(`/tipos-material/${id}`);
  return data;
};

export const createTipoMaterial = async (payload) => {
  const { data } = await api.post("/tipos-material", payload);
  return data;
};

export const updateTipoMaterial = async (id, payload) => {
  const { data } = await api.put(`/tipos-material/${id}`, payload);
  return data;
};

export const deleteTipoMaterial = async (id) => {
  const { data } = await api.delete(`/tipos-material/${id}`);
  return data;
};

export const restoreTipoMaterial = async (id) => {
  const { data } = await api.patch(`/tipos-material/${id}/restore`);
  return data;
};