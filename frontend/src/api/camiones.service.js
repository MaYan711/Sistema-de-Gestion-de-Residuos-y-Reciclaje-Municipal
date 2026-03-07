import { api } from "./axios";

export const getCamiones = async (params = {}) => {
  const { data } = await api.get("/camiones", { params });
  return data;
};

export const getCamionById = async (id) => {
  const { data } = await api.get(`/camiones/${id}`);
  return data;
};

export const createCamion = async (payload) => {
  const { data } = await api.post("/camiones", payload);
  return data;
};

export const updateCamion = async (id, payload) => {
  const { data } = await api.put(`/camiones/${id}`, payload);
  return data;
};

export const deleteCamion = async (id) => {
  const { data } = await api.delete(`/camiones/${id}`);
  return data;
};

export const getConductoresCamion = async () => {
  const { data } = await api.get("/camiones/conductores");
  return data;
};