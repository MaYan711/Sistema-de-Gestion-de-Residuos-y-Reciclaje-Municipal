export default function PuntosRecoleccionTable({
  puntos,
  onMarcarRecolectado,
  onMarcarPendiente,
  loading,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Puntos de recolección</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Orden</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Volumen estimado</th>
                <th>Estado</th>
                <th>Hora recolección</th>
                <th style={{ width: 170 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && puntos.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No hay puntos generados
                  </td>
                </tr>
              )}

              {puntos.map((punto) => (
                <tr key={punto.id_punto}>
                  <td>{punto.id_punto}</td>
                  <td>{punto.orden}</td>
                  <td>{punto.latitud}</td>
                  <td>{punto.longitud}</td>
                  <td>{punto.volumen_estimado} kg</td>
                  <td>
                    <span className={`badge ${punto.recolectado ? "text-bg-success" : "text-bg-warning"}`}>
                      {punto.recolectado ? "Recolectado" : "Pendiente"}
                    </span>
                  </td>
                  <td>{punto.hora_recoleccion ?? "—"}</td>
                  <td>
                    {punto.recolectado ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => onMarcarPendiente(punto.id_punto)}
                        disabled={loading}
                      >
                        Marcar pendiente
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => onMarcarRecolectado(punto.id_punto)}
                        disabled={loading}
                      >
                        Marcar recolectado
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan="8" className="text-center">
                    Cargando...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}