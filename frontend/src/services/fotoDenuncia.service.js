import { api } from "../api/axios.js";

export async function getFotosDenuncia(idDenuncia) {
  const { data } = await api.get(`/denuncias/${idDenuncia}/fotos`);
  return data;
}

export async function uploadFotoDenuncia(idDenuncia, tipo, file) {
  const formData = new FormData();
  formData.append("tipo_foto", tipo);
  formData.append("foto", file);

  const { data } = await api.post(`/denuncias/${idDenuncia}/fotos`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}