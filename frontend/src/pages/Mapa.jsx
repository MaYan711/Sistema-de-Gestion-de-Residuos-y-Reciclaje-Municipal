import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { api } from "../api/axios.js";

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

export default function Mapa() {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    latitud: "",
    longitud: "",
    capacidad: 0,
    horario: "08:00-17:00",
    activo: true,
    id_encargado: "",
  });

  const center = useMemo(() => [14.634915, -90.506882], []);

  const loadPuntos = () => {
    setLoading(true);
    api.get("/puntos-verdes")
      .then((r) => setPuntos(r.data?.data || []))
      .catch((e) => console.log(e.response?.data || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPuntos();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      direccion: "",
      latitud: "",
      longitud: "",
      capacidad: 0,
      horario: "08:00-17:00",
      activo: true,
      id_encargado: "",
    });
    setPickMode(false);
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre ?? "",
      direccion: p.direccion ?? "",
      latitud: p.latitud != null ? String(p.latitud) : "",
      longitud: p.longitud != null ? String(p.longitud) : "",
      capacidad: p.capacidad ?? 0,
      horario: p.horario ?? "08:00-17:00",
      activo: !!p.activo,
      id_encargado: p.id_encargado != null ? String(p.id_encargado) : "",
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
      nombre: form.nombre.trim(),
      direccion: form.direccion.trim(),
      latitud: Number(String(form.latitud).replace(",", ".")),
      longitud: Number(String(form.longitud).replace(",", ".")),
      capacidad: form.capacidad !== "" ? Number(form.capacidad) : 0,
      horario: form.horario?.trim() || null,
      activo: !!form.activo,
    };

    const idEnc = String(form.id_encargado ?? "").trim();
    if (idEnc !== "") payload.id_encargado = Number(idEnc);

    try {
      if (editingId) {
        await api.put(`/puntos-verdes/${editingId}`, payload);
      } else {
        await api.post("/puntos-verdes", payload);
      }
      closeModal();
      loadPuntos();
    } catch (err) {
      console.log("PV error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "No se pudo guardar";
      alert(msg);
    }
  };

  return (
    <div className="container">
      <h2>Mapa</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <MapContainer center={center} zoom={12} style={{ height: "70vh", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            <ClickCapture enabled={pickMode} onPick={onPick} />

            {puntos.filter(p => p.activo).map((p) => (
              <Marker key={p.id} position={[Number(p.latitud), Number(p.longitud)]}>
                <Popup>
                  <strong>{p.nombre}</strong>
                  <br />
                  {p.direccion || ""}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Puntos Verdes</h3>
            <button className="btn" type="button" onClick={openCreate}>
              + Agregar
            </button>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {loading ? (
              <p>Cargando...</p>
            ) : puntos.length === 0 ? (
              <p>No hay puntos verdes.</p>
            ) : (
              puntos.filter(p => p.activo).map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: 10,
                    cursor: "pointer",
                  }}
                  onClick={() => openEdit(p)}
                >
                  <div style={{ fontWeight: 700 }}>{p.nombre}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{p.direccion || ""}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {Number(p.latitud).toFixed(6)}, {Number(p.longitud).toFixed(6)}
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
            style={{ width: 520, maxWidth: "100%", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{editingId ? "Editar Punto Verde" : "Nuevo Punto Verde"}</h3>
              <button className="btn" type="button" onClick={closeModal}>
                X
              </button>
            </div>

            <form onSubmit={submit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <input
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              />
              <input
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  placeholder="Latitud"
                  value={form.latitud}
                  onChange={(e) => setForm((f) => ({ ...f, latitud: e.target.value }))}
                />
                <input
                  placeholder="Longitud"
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  type="number"
                  placeholder="Capacidad"
                  value={form.capacidad}
                  onChange={(e) => setForm((f) => ({ ...f, capacidad: e.target.value }))}
                />
                <input
                  placeholder="Horario"
                  value={form.horario}
                  onChange={(e) => setForm((f) => ({ ...f, horario: e.target.value }))}
                />
              </div>

              <input
                type="number"
                placeholder="ID encargado"
                value={form.id_encargado}
                onChange={(e) => setForm((f) => ({ ...f, id_encargado: e.target.value }))}
              />

              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={!!form.activo}
                  onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                />
                Activo
              </label>

              <button className="btn" type="submit">
                Guardar
              </button>

              <button
          className="btn"
          type="button"
          onClick={() => setConfirmDelete(true)}
        >
          Eliminar
        </button>

{confirmDelete && (
  <div style={{marginTop:10, padding:10, border:"1px solid rgba(255,255,255,0.1)", borderRadius:8}}>
    <p>¿Eliminar este punto verde?</p>

    <div style={{display:"flex", gap:10}}>
      <button
        className="btn"
        type="button"
        onClick={async () => {
          try {
            await api.patch(`/puntos-verdes/${editingId}/deactivate`);
            setConfirmDelete(false);
            closeModal();
            loadPuntos();
          } catch (err) {
            console.log("DELETE PV error:", err.response?.data || err.message);
            alert("No se pudo eliminar");
          }
        }}
      >
        Confirmar
      </button>

      <button
        className="btn"
        type="button"
        onClick={() => setConfirmDelete(false)}
      >
        Cancelar
      </button>
    </div>
  </div>
)}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}