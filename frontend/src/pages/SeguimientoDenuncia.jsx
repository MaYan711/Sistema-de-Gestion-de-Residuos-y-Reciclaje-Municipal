import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SeguimientoDenuncia() {
  const [searchParams] = useSearchParams();
  const [codigo, setCodigo] = useState(searchParams.get("codigo") || "");
  const [data, setData] = useState(null);

  const buscarCodigo = async (codigoBuscar) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/denuncias/seguimiento/${codigoBuscar}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "No se encontró el código");
      }

      setData(json.data || null);
    } catch (err) {
      alert(err.message);
      setData(null);
    }
  };

  useEffect(() => {
    const codigoUrl = searchParams.get("codigo");
    if (codigoUrl) {
      setCodigo(codigoUrl);
      buscarCodigo(codigoUrl);
    }
  }, [searchParams]);

  const buscar = async (e) => {
    e.preventDefault();
    await buscarCodigo(codigo);
  };

  return (
    <div className="container">
      <h2>Seguimiento de Denuncia</h2>

      <form onSubmit={buscar} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input
          placeholder="Código de seguimiento"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button className="btn" type="submit">
          Consultar
        </button>
      </form>

      {data && (
        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
          <div className="card">
            <h3>{data.denuncia.codigo_segui}</h3>
            <p><strong>Estado:</strong> {data.denuncia.estado}</p>
            <p><strong>Dirección:</strong> {data.denuncia.direccion}</p>
            <p><strong>Descripción:</strong> {data.denuncia.descripcion}</p>
            <p><strong>Tamaño:</strong> {data.denuncia.tamano}</p>
            <p><strong>Ciudadano:</strong> {data.denuncia.ciudadano_nombre}</p>
            <p><strong>Teléfono:</strong> {data.denuncia.ciudadano_telefono}</p>
            <p><strong>Email:</strong> {data.denuncia.ciudadano_email}</p>
            <p><strong>Cuadrilla:</strong> {data.denuncia.cuadrilla_nombre || "No asignada"}</p>
          </div>

          <div className="card">
            <h3>Historial</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {data.historial.map((h) => (
                <div
                  key={h.id_seguimiento}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <div>
                    <strong>{h.estado_anterior || "-"}</strong> → <strong>{h.estado_nuevo}</strong>
                  </div>
                  <div>{h.fecha}</div>
                  <div>{h.usuario_nombre || ""}</div>
                  <div>{h.observaciones_json?.fecha_programada || ""}</div>
                  <div>{h.observaciones_json?.recursos || h.observaciones || ""}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}