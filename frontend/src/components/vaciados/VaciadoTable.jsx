function badgeEstado(estado) {
  if (estado === "programado") return "bg-warning text-dark";
  if (estado === "completado") return "bg-success";
  return "bg-secondary";
}

function VaciadoTable({ vaciados, onCompletar, loading }) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Vaciados programados y realizados</h5>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Contenedor</th>
                <th>Punto verde</th>
                <th>Material</th>
                <th>Nivel</th>
                <th>Programado</th>
                <th>Realizado</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Observaciones</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vaciados.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    No hay vaciados registrados
                  </td>
                </tr>
              ) : (
                vaciados.map((item) => (
                  <tr key={item.id_vaciado}>
                    <td>{item.id_vaciado}</td>
                    <td>{item.contenedor_codigo}</td>
                    <td>{item.punto_verde_nombre}</td>
                    <td>{item.tipo_material_nombre}</td>
                    <td>{Number(item.contenedor_nivel_llenado).toFixed(2)}%</td>
                    <td>{item.fecha_prog}</td>
                    <td>{item.fecha_realizado || "-"}</td>
                    <td>{item.usuario_nombre}</td>
                    <td>
                      <span className={`badge ${badgeEstado(item.estado)}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td>{item.observaciones || "-"}</td>
                    <td>
                      {item.estado === "programado" && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onCompletar(item.id_vaciado)}
                          disabled={loading}
                        >
                          Completar
                        </button>
                      )}
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

export default VaciadoTable;