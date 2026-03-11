import { api } from "./axios";

export const getVaciados = async () => {
  const response = await api.get("/vaciados");
  return response.data;
};

export const programarVaciado = async (payload) => {
  const response = await api.post("/vaciados/programar", payload);
  return response.data;
};

export const completarVaciado = async (id) => {
  const response = await api.patch(`/vaciados/${id}/completar`);
  return response.data;
};