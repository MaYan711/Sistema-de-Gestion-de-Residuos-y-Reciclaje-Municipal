import { useState } from "react";
import { api } from "../api/axios.js";

export default function Seguimiento() {
  const [codigo, setCodigo] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const buscar = async () => {
    setErr("");
    setData(null);
    const c = codigo.trim();
    if (!c) return;

    try {
      const r = await api.get(`/denuncias/seguimiento/${encodeURIComponent(c)}`, {
        headers: { Authorization: undefined },
      });
      setData(r.data?.data || null);
    } catch (e) {
      setErr(e.response?.data?.message || "No encontrado");
    }
  };

  return (
    <div className="container">
      <h2>Seguimiento de denuncia</h2>

      <div className="card" style={{ display: "grid", gap: 10, maxWidth: 720 }}>
        <input
          placeholder="Código (ej: DN-XXXXXX)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button className="btn" type="button" onClick={buscar}>
          Consultar
        </button>

        {err && <div style={{ opacity: 0.85 }}>{err}</div>}

        {data && (
          <>
            <div style={{ fontWeight: 700 }}>{data.denuncia.codigo_segui}</div>
            <div>{data.denuncia.estado}</div>
            <div>{data.denuncia.direccion}</div>
            <div>{data.denuncia.descripcion}</div>
            <div>{data.denuncia.tamano}</div>

            <div style={{ marginTop: 10, fontWeight: 700 }}>Historial</div>
            <div style={{ display: "grid", gap: 8 }}>
              {data.historial.map((h, i) => (
                <div key={i} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>{h.fecha}</div>
                  <div>{h.estado_anterior || "-"} → {h.estado_nuevo}</div>
                  {h.observaciones && <pre style={{ margin: 0, whiteSpace: "pre-wrap", opacity: 0.9 }}>{h.observaciones}</pre>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}