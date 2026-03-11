import { api } from "./axios";

export const getNotificacionesContenedores = async () => {
  const response = await api.get("/notificaciones/contenedores");
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload?.data ?? [];
};

export const marcarNotificacionLeida = async (id) => {
  const response = await api.patch(`/notificaciones/${id}/leida`);
  return response.data;
};