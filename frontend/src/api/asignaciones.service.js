import { api } from "./axios";

export const getAsignacionesRuta = async (params = {}) => {
  const { data } = await api.get("/asignaciones-ruta", { params });
  return data;
};

export const getAsignacionRutaById = async (id) => {
  const { data } = await api.get(`/asignaciones-ruta/${id}`);
  return data;
};

export const createAsignacionRuta = async (payload) => {
  const { data } = await api.post("/asignaciones-ruta", payload);
  return data;
};

export const updateAsignacionRuta = async (id, payload) => {
  const { data } = await api.put(`/asignaciones-ruta/${id}`, payload);
  return data;
};

export const deleteAsignacionRuta = async (id) => {
  const { data } = await api.delete(`/asignaciones-ruta/${id}`);
  return data;
};

export const getRutasDisponiblesAsignacion = async () => {
  const { data } = await api.get("/asignaciones-ruta/rutas-disponibles");
  return data;
};

export const getCamionesDisponiblesAsignacion = async () => {
  const { data } = await api.get("/asignaciones-ruta/camiones-disponibles");
  return data;
};