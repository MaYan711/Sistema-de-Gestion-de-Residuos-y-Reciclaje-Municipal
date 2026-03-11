import { api } from "./axios";

export const getRecoleccionPorDia = async () => {
  const res = await api.get("/reportes/recoleccion/dia");
  return res.data;
};

export const getRecoleccionPorRuta = async () => {
  const res = await api.get("/reportes/recoleccion/ruta");
  return res.data;
};

export const getRecoleccionPorZona = async () => {
  const res = await api.get("/reportes/recoleccion/zona");
  return res.data;
};