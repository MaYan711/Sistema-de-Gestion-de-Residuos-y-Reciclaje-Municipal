import { api } from "./axios";

export const registerCiudadano = async (payload) => {
  const res = await api.post("/register-ciudadano", payload);
  return res.data;
};