export default function CamionTable({
  camiones,
  onEdit,
  onDelete,
  loading,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de camiones</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Conductor</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && camiones.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No hay camiones registrados
                  </td>
                </tr>
              )}

              {camiones.map((camion) => (
                <tr key={camion.id_camion}>
                  <td>{camion.id_camion}</td>
                  <td>{camion.placa}</td>
                  <td>{camion.capacidad} ton</td>
                  <td>
                    <span
                      className={`badge ${
                        camion.estado === "operativo"
                          ? "text-bg-success"
                          : camion.estado === "mantenimiento"
                          ? "text-bg-warning"
                          : "text-bg-secondary"
                      }`}
                    >
                      {camion.estado}
                    </span>
                  </td>
                  <td>{camion.conductor?.nombre ?? "Sin conductor"}</td>
                  <td>{camion.marca ?? "—"}</td>
                  <td>{camion.modelo ?? "—"}</td>
                  <td>{camion.anio ?? "—"}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(camion)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(camion.id_camion)}
                      >
                        Inactivar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan="9" className="text-center">
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