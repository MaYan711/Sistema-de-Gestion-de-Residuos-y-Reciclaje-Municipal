import { api } from "./axios";

export const getZonas = async (params = {}) => {
  const { data } = await api.get("/zonas", { params });
  return data;
};

export const getZonaById = async (id) => {
  const { data } = await api.get(`/zonas/${id}`);
  return data;
};

export const createZona = async (payload) => {
  const { data } = await api.post("/zonas", payload);
  return data;
};

export const updateZona = async (id, payload) => {
  const { data } = await api.put(`/zonas/${id}`, payload);
  return data;
};

export const deleteZona = async (id) => {
  const { data } = await api.delete(`/zonas/${id}`);
  return data;
};

export const restoreZona = async (id) => {
  const { data } = await api.patch(`/zonas/${id}/restore`);
  return data;
};