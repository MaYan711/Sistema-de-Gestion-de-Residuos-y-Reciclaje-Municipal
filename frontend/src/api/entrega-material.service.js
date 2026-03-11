import { api } from "./axios";

export const getEntregaCatalogos = async () => {
  const response = await api.get("/entregas-material/catalogos");
  return response.data;
};

export const getEntregasMaterial = async () => {
  const response = await api.get("/entregas-material");
  return response.data;
};

export const createEntregaMaterial = async (payload) => {
  const response = await api.post("/entregas-material", payload);
  return response.data;
};