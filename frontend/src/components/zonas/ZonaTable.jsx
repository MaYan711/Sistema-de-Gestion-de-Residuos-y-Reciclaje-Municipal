function ZonaTable({ zonas, onEdit, onDelete, onRestore, loading }) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de zonas</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Densidad</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Estado</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && zonas.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No hay zonas registradas
                  </td>
                </tr>
              )}

              {zonas.map((zona) => (
                <tr key={zona.id_zona}>
                  <td>{zona.id_zona}</td>
                  <td>{zona.nombre}</td>
                  <td className="text-capitalize">{zona.tipo}</td>
                  <td>{Number(zona.densidad_pobla).toLocaleString()}</td>
                  <td>
                    {zona.latitud_centro !== null && zona.latitud_centro !== undefined
                      ? zona.latitud_centro
                      : "—"}
                  </td>
                  <td>
                    {zona.longitud_centro !== null && zona.longitud_centro !== undefined
                      ? zona.longitud_centro
                      : "—"}
                  </td>
                  <td>
                    <span className={`badge ${zona.activo ? "text-bg-success" : "text-bg-secondary"}`}>
                      {zona.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(zona)}
                      >
                        Editar
                      </button>

                      {zona.activo ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(zona.id_zona)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onRestore(zona.id_zona)}
                        >
                          Reactivar
                        </button>
                      )}
                    </div>
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

export default ZonaTable;