function UsuarioTable({ usuarios, onEdit, onToggleActivo, loading }) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de usuarios</h5>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Creado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefono || "-"}</td>
                    <td>{usuario.rol_nombre}</td>
                    <td>
                      <span className={`badge ${usuario.activo ? "bg-success" : "bg-danger"}`}>
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>{usuario.created_at || "-"}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(usuario)}
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        className={`btn btn-sm ${usuario.activo ? "btn-danger" : "btn-success"}`}
                        onClick={() => onToggleActivo(usuario)}
                        disabled={loading}
                      >
                        {usuario.activo ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsuarioTable;