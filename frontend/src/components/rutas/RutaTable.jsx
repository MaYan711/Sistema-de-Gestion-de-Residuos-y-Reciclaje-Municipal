import RutaMiniMap from "./RutaMiniMap";

function RutaTable({ rutas, onEdit, onDelete, onRestore, loading }) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Listado de rutas</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Zona</th>
                <th>Mapa</th>
                <th>Distancia</th>
                <th>Días</th>
                <th>Horario</th>
                <th>Residuo</th>
                <th>Estado</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rutas.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center">
                    No hay rutas registradas
                  </td>
                </tr>
              )}

              {rutas.map((ruta) => (
                <tr key={ruta.id_ruta}>
                  <td>{ruta.id_ruta}</td>
                  <td>{ruta.nombre}</td>
                  <td>{ruta.zona?.nombre ?? "—"}</td>
                  <td style={{ minWidth: 240 }}>
                    <RutaMiniMap ruta={ruta} />
                  </td>
                  <td>{ruta.distancia} km</td>
                  <td>{ruta.dias_recole}</td>
                  <td>{ruta.horario}</td>
                  <td className="text-capitalize">{ruta.tipo_residuo}</td>
                  <td>
                    <span className={`badge ${ruta.activo ? "text-bg-success" : "text-bg-secondary"}`}>
                      {ruta.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-warning" onClick={() => onEdit(ruta)}>
                        Editar
                      </button>

                      {ruta.activo ? (
                        <button className="btn btn-sm btn-danger" onClick={() => onDelete(ruta.id_ruta)}>
                          Desactivar
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-success" onClick={() => onRestore(ruta.id_ruta)}>
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

export default RutaTable;