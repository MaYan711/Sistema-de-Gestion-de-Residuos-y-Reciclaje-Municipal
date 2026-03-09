function TipoMaterialTable({
  tipos,
  onEdit,
  onDelete,
  onRestore,
  loading,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de tipos de material</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Unidad de medida</th>
                <th>Estado</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && tipos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay tipos de material registrados
                  </td>
                </tr>
              )}

              {tipos.map((tipo) => (
                <tr key={tipo.id_tipo}>
                  <td>{tipo.id_tipo}</td>
                  <td>{tipo.nombre}</td>
                  <td>{tipo.descripcion || "—"}</td>
                  <td>{tipo.unidad_medida}</td>
                  <td>
                    <span className={`badge ${tipo.activo ? "text-bg-success" : "text-bg-secondary"}`}>
                      {tipo.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(tipo)}
                      >
                        Editar
                      </button>

                      {tipo.activo ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(tipo.id_tipo)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onRestore(tipo.id_tipo)}
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
                  <td colSpan="6" className="text-center">
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

export default TipoMaterialTable;