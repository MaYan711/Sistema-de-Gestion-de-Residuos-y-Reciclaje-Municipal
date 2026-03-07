import { api } from "./axios";

export const getRutas = async (params = {}) => {
  const { data } = await api.get("/rutas", { params });
  return data;
};

export const getRutaById = async (id) => {
  const { data } = await api.get(`/rutas/${id}`);
  return data;
};

export const createRuta = async (payload) => {
  const { data } = await api.post("/rutas", payload);
  return data;
};

export const updateRuta = async (id, payload) => {
  const { data } = await api.put(`/rutas/${id}`, payload);
  return data;
};

export const deleteRuta = async (id) => {
  const { data } = await api.delete(`/rutas/${id}`);
  return data;
};

export const restoreRuta = async (id) => {
  const { data } = await api.patch(`/rutas/${id}/restore`);
  return data;
};