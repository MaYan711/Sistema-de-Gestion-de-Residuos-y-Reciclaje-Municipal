import { api } from "./axios";

export const getAsignacionesMonitoreo = async (params = {}) => {
  const { data } = await api.get("/asignaciones-ruta", { params });
  return data;
};

export const getAsignacionDetalleMonitoreo = async (id) => {
  const { data } = await api.get(`/asignaciones-ruta/${id}`);
  return data;
};