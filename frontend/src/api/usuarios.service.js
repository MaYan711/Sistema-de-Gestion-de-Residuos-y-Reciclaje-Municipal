import { api } from "./axios";

export const getRolesUsuarios = async () => {
  const res = await api.get("/usuarios/roles");
  return res.data;
};

export const getUsuarios = async (idRol = "") => {
  const params = {};
  if (idRol) params.id_rol = idRol;

  const res = await api.get("/usuarios", { params });
  return res.data;
};

export const getUsuarioById = async (id) => {
  const res = await api.get(`/usuarios/${id}`);
  return res.data;
};

export const createUsuario = async (payload) => {
  const res = await api.post("/usuarios", payload);
  return res.data;
};

export const updateUsuario = async (id, payload) => {
  const res = await api.put(`/usuarios/${id}`, payload);
  return res.data;
};

export const toggleActivoUsuario = async (id) => {
  const res = await api.patch(`/usuarios/${id}/toggle-activo`);
  return res.data;
};