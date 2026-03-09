import { api } from "./axios";

export const marcarPuntoRecolectado = async (id) => {
  const { data } = await api.patch(`/puntos-recoleccion/${id}/recolectado`);
  return data;
};

export const marcarPuntoPendiente = async (id) => {
  const { data } = await api.patch(`/puntos-recoleccion/${id}/pendiente`);
  return data;
};