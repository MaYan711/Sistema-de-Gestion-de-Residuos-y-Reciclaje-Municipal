function ContenedorTable({ contenedores, onEdit, onDelete, onRestore, loading }) {
  const lista = Array.isArray(contenedores) ? contenedores : [];

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de contenedores</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Punto verde</th>
                <th>Tipo material</th>
                <th>Capacidad kg</th>
                <th>Nivel %</th>
                <th>Estado</th>
                <th>Activo</th>
                <th>Último vaciado</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && lista.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center">
                    No hay contenedores registrados
                  </td>
                </tr>
              )}

              {lista.map((contenedor) => (
                <tr key={contenedor.id_contenedor}>
                  <td>{contenedor.id_contenedor}</td>
                  <td>{contenedor.codigo}</td>
                  <td>{contenedor.punto_verde?.nombre || "—"}</td>
                  <td>{contenedor.tipo_material?.nombre || "—"}</td>
                  <td>{Number(contenedor.capacidad_kg).toLocaleString()}</td>
                  <td>{Number(contenedor.nivel_llenado).toLocaleString()}</td>
                  <td>
                    <span className="badge text-bg-info text-capitalize">
                      {contenedor.estado}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${contenedor.activo ? "text-bg-success" : "text-bg-secondary"}`}>
                      {contenedor.activo ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>{contenedor.ultimo_vaciado || "—"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(contenedor)}
                      >
                        Editar
                      </button>

                      {contenedor.activo ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(contenedor.id_contenedor)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onRestore(contenedor.id_contenedor)}
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
                  <td colSpan="10" className="text-center">
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

export default ContenedorTable;