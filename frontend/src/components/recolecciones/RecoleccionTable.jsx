export default function RecoleccionTable({
  recolecciones,
  onEdit,
  onDelete,
  loading,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de recolecciones</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ruta</th>
                <th>Camión</th>
                <th>Estado</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Peso real</th>
                <th>Incidencias</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && recolecciones.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No hay recolecciones registradas
                  </td>
                </tr>
              )}

              {recolecciones.map((recoleccion) => (
                <tr key={recoleccion.id_recoleccion}>
                  <td>{recoleccion.id_recoleccion}</td>
                  <td>{recoleccion.asignacion?.ruta?.nombre ?? "—"}</td>
                  <td>{recoleccion.asignacion?.camion?.placa ?? "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        recoleccion.estado === "programada"
                          ? "text-bg-secondary"
                          : recoleccion.estado === "en_proceso"
                          ? "text-bg-primary"
                          : recoleccion.estado === "completada"
                          ? "text-bg-success"
                          : "text-bg-warning"
                      }`}
                    >
                      {recoleccion.estado}
                    </span>
                  </td>
                  <td>{recoleccion.horario_ini ?? "—"}</td>
                  <td>{recoleccion.horario_fin ?? "—"}</td>
                  <td>{recoleccion.basura_ton ?? "—"}</td>
                  <td>{recoleccion.incidencias?.length ?? 0}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(recoleccion)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(recoleccion.id_recoleccion)}
                      >
                        Eliminar
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