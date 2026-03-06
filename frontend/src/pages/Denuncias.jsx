import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { api } from "../api/axios.js";
import {useNavigate} from "react-router-dom";

function ClickCapture({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      const { lat, lng } = e.latlng;
      onPick({ latitud: lat, longitud: lng });
    },
  });
  return null;
}

const ESTADOS = ["recibida", "en_revision", "asignada", "en_atencion", "atendida", "cerrada"];
const TAMANOS = ["pequeno", "mediano", "grande"];

export default function Denuncias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const [open, setOpen] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    direccion: "",
    descripcion: "",
    tamano: "mediano",
    latitud: "",
    longitud: "",
    id_zona: "",
  });

  const [cuadrillas, setCuadrillas] = useState([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignId, setAssignId] = useState(null);
  const [assignForm, setAssignForm] = useState({
    id_cuadrilla: "",
    fecha_programada: "",
    recursos: "",
  });

  const center = useMemo(() => [14.634915, -90.506882], []);

  const load = () => {
    setLoading(true);

    const params = {};
    if (estadoFiltro) params.estado = estadoFiltro;
    if (q.trim() !== "") params.q = q.trim();

    api
      .get("/denuncias", { params })
      .then((r) => setItems(r.data?.data || []))
      .catch((e) => console.log(e.response?.data || e.message))
      .finally(() => setLoading(false));
  };

  const loadCuadrillas = () => {
    api
      .get("/cuadrillas")
      .then((r) => setCuadrillas(r.data?.data || []))
      .catch((e) => console.log(e.response?.data || e.message));
  };

  useEffect(() => {
    load();
    loadCuadrillas();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      direccion: "",
      descripcion: "",
      tamano: "mediano",
      latitud: "",
      longitud: "",
      id_zona: "",
    });
    setPickMode(false);
    setOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({
      direccion: d.direccion ?? "",
      descripcion: d.descripcion ?? "",
      tamano: d.tamano ?? "mediano",
      latitud: d.latitud != null ? String(d.latitud) : "",
      longitud: d.longitud != null ? String(d.longitud) : "",
      id_zona: d.id_zona != null ? String(d.id_zona) : "",
    });
    setPickMode(false);
    setOpen(true);
  };

  const closeModal = () => {
    setPickMode(false);
    setOpen(false);
  };

  const onPick = ({ latitud, longitud }) => {
    setForm((f) => ({
      ...f,
      latitud: Number(latitud).toFixed(6),
      longitud: Number(longitud).toFixed(6),
    }));
    setPickMode(false);
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      direccion: form.direccion.trim(),
      descripcion: form.descripcion.trim(),
      tamano: form.tamano,
      latitud: form.latitud !== "" ? Number(String(form.latitud).replace(",", ".")) : null,
      longitud: form.longitud !== "" ? Number(String(form.longitud).replace(",", ".")) : null,
      id_zona: String(form.id_zona).trim() !== "" ? Number(form.id_zona) : null,
    };

    try {
      if (editingId) {
        await api.put(`/denuncias/${editingId}`, payload);
      } else {
        await api.post("/denuncias", payload);
      }
      closeModal();
      load();
    } catch (err) {
      console.log("DEN error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "No se pudo guardar";
      alert(msg);
    }
  };

  const changeEstado = async (id, estado) => {
    try {
      await api.patch(`/denuncias/${id}/estado`, { estado });
      load();
    } catch (err) {
      console.log("DEN estado error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "No se pudo cambiar el estado";
      alert(msg);
    }
  };

  const remove = async (id, nombreRef) => {
    const ok = confirm(`Eliminar denuncia ${nombreRef}?`);
    if (!ok) return;

    try {
      await api.delete(`/denuncias/${id}`);
      load();
    } catch (err) {
      console.log("DEN delete error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "No se pudo eliminar";
      alert(msg);
    }
  };

  const applyFilters = () => load();

  const openAssign = (d) => {
  setAssignId(d.id);
  setAssignForm({
    id_cuadrilla: d.id_cuadrilla != null ? String(d.id_cuadrilla) : "",
    fecha_programada: d.fecha_programada ?? "",
    recursos: d.recursos ?? "",
  });
  setAssignOpen(true);
};

  const closeAssign = () => {
    setAssignOpen(false);
    setAssignId(null);
    setAssignForm({
      id_cuadrilla: "",
      fecha_programada: "",
      recursos: "",
    });
  };

  const submitAssign = async (e) => {
    e.preventDefault();

    const payload = {
      id_cuadrilla: Number(assignForm.id_cuadrilla),
      fecha_programada: assignForm.fecha_programada,
      recursos: assignForm.recursos.trim() || null,
    };

    try {
      await api.patch(`/denuncias/${assignId}/asignar`, payload);
      closeAssign();
      load();
    } catch (err) {
      console.log("DEN assign error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "No se pudo asignar cuadrilla";
      alert(msg);
    }
  };

  return (
    <div className="container">
      <h2>Denuncias</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <MapContainer center={center} zoom={12} style={{ height: "70vh", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <ClickCapture enabled={pickMode} onPick={onPick} />

            {items
              .filter((d) => d.latitud != null && d.longitud != null)
              .map((d) => (
                <Marker key={d.id} position={[Number(d.latitud), Number(d.longitud)]}>
                  <Popup>
                    <strong>{d.codigo_segui}</strong>
                    <br />
                    {d.direccion}
                    <br />
                    {d.estado}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: 0 }}>Listado</h3>
            <button className="btn" type="button" onClick={openCreate}>
              + Agregar
            </button>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <input
              placeholder="Buscar (dirección, descripción, código, ciudadano)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
              <option value="">Todos los estados</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <button className="btn" type="button" onClick={applyFilters}>
              Aplicar filtros
            </button>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {loading ? (
              <p>Cargando...</p>
            ) : items.length === 0 ? (
              <p>No hay denuncias.</p>
            ) : (
              items.map((d) => (
                <div
                  key={d.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 700 }}>{d.codigo_segui}</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>{d.fecha}</div>
                  </div>

                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                    {d.ciudadano_nombre || "Ciudadano"}
                  </div>

                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                    {d.direccion}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <select value={d.estado} onChange={(e) => changeEstado(d.id, e.target.value)}>
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>

                    <button className="btn" type="button" onClick={() => openEdit(d)}>
                      Editar
                    </button>

                    <button className="btn" type="button" onClick={() => openAssign(d)}>
                      Asignar cuadrilla
                    </button>

                    <button
                        className="btn"
                        type="button"
                        onClick={() => navigate(`/seguimiento-denuncia?codigo=${encodeURIComponent(d.codigo_segui)}`)}
                        >
                        Ver seguimiento
                        </button>

                    <button className="btn" type="button" onClick={() => remove(d.id, d.codigo_segui)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            zIndex: 9999,
          }}
          onClick={closeModal}
        >
          <div
            className="card"
            style={{ width: 560, maxWidth: "100%", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{editingId ? "Editar Denuncia" : "Nueva Denuncia"}</h3>
              <button className="btn" type="button" onClick={closeModal}>
                X
              </button>
            </div>

            <form onSubmit={submit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <input
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
              />

              <textarea
                placeholder="Descripción"
                rows={4}
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <select value={form.tamano} onChange={(e) => setForm((f) => ({ ...f, tamano: e.target.value }))}>
                  {TAMANOS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="ID Zona (opcional)"
                  value={form.id_zona}
                  onChange={(e) => setForm((f) => ({ ...f, id_zona: e.target.value }))}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  placeholder="Latitud (opcional)"
                  value={form.latitud}
                  onChange={(e) => setForm((f) => ({ ...f, latitud: e.target.value }))}
                />
                <input
                  placeholder="Longitud (opcional)"
                  value={form.longitud}
                  onChange={(e) => setForm((f) => ({ ...f, longitud: e.target.value }))}
                />
              </div>

              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPickMode(true);
                  setOpen(false);
                }}
              >
                Seleccionar en el mapa
              </button>

              <button className="btn" type="submit">
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}

      {assignOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            zIndex: 9999,
          }}
          onClick={closeAssign}
        >
          <div
            className="card"
            style={{ width: 520, maxWidth: "100%", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Asignar cuadrilla</h3>
              <button className="btn" type="button" onClick={closeAssign}>
                X
              </button>
            </div>

            <form onSubmit={submitAssign} style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <select
                value={assignForm.id_cuadrilla}
                onChange={(e) => setAssignForm((f) => ({ ...f, id_cuadrilla: e.target.value }))}
                required
              >
                <option value="">Seleccionar equipo disponible</option>
                {cuadrillas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={assignForm.fecha_programada}
                onChange={(e) => setAssignForm((f) => ({ ...f, fecha_programada: e.target.value }))}
                required
              />

              <textarea
                rows={4}
                placeholder="Recursos necesarios"
                value={assignForm.recursos}
                onChange={(e) => setAssignForm((f) => ({ ...f, recursos: e.target.value }))}
              />

              <button className="btn" type="submit">
                Guardar asignación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}