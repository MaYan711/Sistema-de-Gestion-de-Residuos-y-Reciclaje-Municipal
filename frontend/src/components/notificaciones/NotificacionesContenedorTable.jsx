function NotificacionesContenedorTable({ notificaciones, onMarcarLeida, loading }) {
  const lista = Array.isArray(notificaciones) ? notificaciones : [];

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Alertas de contenedores</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mensaje</th>
                <th>Email destino</th>
                <th>Leída</th>
                <th>Fecha</th>
                <th style={{ width: 140 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {!loading && lista.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay alertas registradas
                  </td>
                </tr>
              )}

              {lista.map((item) => (
                <tr key={item.id_notificacion}>
                  <td>{item.id_notificacion}</td>
                  <td>{item.mensaje}</td>
                  <td>{item.email_destino || "—"}</td>
                  <td>
                    <span className={`badge ${item.leida ? "text-bg-success" : "text-bg-warning"}`}>
                      {item.leida ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>{item.fecha}</td>
                  <td>
                    {!item.leida && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onMarcarLeida(item.id_notificacion)}
                      >
                        Marcar leída
                      </button>
                    )}
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

export default NotificacionesContenedorTable;