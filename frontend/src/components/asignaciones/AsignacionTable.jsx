export default function AsignacionTable({
  asignaciones,
  onEdit,
  onDelete,
  loading,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de asignaciones</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ruta</th>
                <th>Zona</th>
                <th>Camión</th>
                <th>Conductor</th>
                <th>Fecha</th>
                <th>Peso estimado</th>
                <th>Puntos generados</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && asignaciones.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No hay asignaciones registradas
                  </td>
                </tr>
              )}

              {asignaciones.map((asignacion) => (
                <tr key={asignacion.id_asignacion}>
                  <td>{asignacion.id_asignacion}</td>
                  <td>{asignacion.ruta?.nombre ?? "—"}</td>
                  <td>{asignacion.ruta?.zona?.nombre ?? "—"}</td>
                  <td>{asignacion.camion?.placa ?? "—"}</td>
                  <td>{asignacion.camion?.conductor?.nombre ?? "Sin conductor"}</td>
                  <td>{asignacion.fecha_asig}</td>
                  <td>{asignacion.peso_estimado} kg</td>
                  <td>{asignacion.puntos_recoleccion?.length ?? 0}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(asignacion)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(asignacion.id_asignacion)}
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