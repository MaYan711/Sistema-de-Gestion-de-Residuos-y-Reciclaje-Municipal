import { api } from "./axios";

export const getDenunciasPorEstado = async () => {
  const res = await api.get("/reportes/denuncias/estado");
  return res.data;
};

export const getTiempoPromedioAtencion = async () => {
  const res = await api.get("/reportes/denuncias/tiempo-promedio");
  return res.data;
};

export const getZonasConMasDenuncias = async () => {
  const res = await api.get("/reportes/denuncias/zonas");
  return res.data;
};