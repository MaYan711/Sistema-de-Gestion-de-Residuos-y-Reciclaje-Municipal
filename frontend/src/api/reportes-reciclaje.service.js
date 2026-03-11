import { api } from "./axios";

export const getReciclajePorTipo = async () => {
  const res = await api.get("/reportes/reciclaje/tipo");
  return res.data;
};

export const getPuntosVerdesActivos = async () => {
  const res = await api.get("/reportes/reciclaje/puntos-verdes");
  return res.data;
};

export const getTendenciaReciclaje = async () => {
  const res = await api.get("/reportes/reciclaje/tendencia");
  return res.data;
};