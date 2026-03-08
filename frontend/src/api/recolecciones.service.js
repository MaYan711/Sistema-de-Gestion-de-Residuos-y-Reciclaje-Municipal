import { api } from "./axios";

export const getRecolecciones = async (params = {}) => {
  const { data } = await api.get("/recolecciones", { params });
  return data;
};

export const getRecoleccionById = async (id) => {
  const { data } = await api.get(`/recolecciones/${id}`);
  return data;
};

export const createRecoleccion = async (payload) => {
  const { data } = await api.post("/recolecciones", payload);
  return data;
};

export const updateRecoleccion = async (id, payload) => {
  const { data } = await api.put(`/recolecciones/${id}`, payload);
  return data;
};

export const deleteRecoleccion = async (id) => {
  const { data } = await api.delete(`/recolecciones/${id}`);
  return data;
};

export const getAsignacionesDisponiblesRecoleccion = async () => {
  const { data } = await api.get("/recolecciones/asignaciones-disponibles");
  return data;
};