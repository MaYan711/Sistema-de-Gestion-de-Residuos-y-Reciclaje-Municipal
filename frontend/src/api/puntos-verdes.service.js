import { api } from "./axios";

function normalizarPuntoVerde(item) {
  return {
    id_punto_verde:
      item.id_punto_verde ??
      item.id_punto ??
      item.id ??
      "",
    nombre:
      item.nombre ??
      item.nombre_punto ??
      item.titulo ??
      "Sin nombre",
    direccion: item.direccion ?? "",
    latitud: item.latitud ?? null,
    longitud: item.longitud ?? null,
    activo: item.activo ?? true,
  };
}

export const getPuntosVerdes = async (params = {}) => {
  const response = await api.get("/puntos-verdes", { params });
  const payload = response.data;

  let lista = [];

  if (Array.isArray(payload)) {
    lista = payload;
  } else if (Array.isArray(payload?.data)) {
    lista = payload.data;
  } else if (Array.isArray(payload?.puntos_verdes)) {
    lista = payload.puntos_verdes;
  } else if (Array.isArray(payload?.puntos)) {
    lista = payload.puntos;
  }

  return lista.map(normalizarPuntoVerde).filter((item) => item.id_punto_verde !== "");
};

export const getPuntoVerdeById = async (id) => {
  const response = await api.get(`/puntos-verdes/${id}`);
  return response.data;
};