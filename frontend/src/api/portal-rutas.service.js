import { api } from "./axios";

export const getPortalZonas = async () => {
  const { data } = await api.get("/portal-rutas/zonas");
  return data;
};

export const getPortalRutas = async (params = {}) => {
  const { data } = await api.get("/portal-rutas", { params });
  return data;
};

export const getPortalRutaById = async (id) => {
  const { data } = await api.get(`/portal-rutas/${id}`);
  return data;
};