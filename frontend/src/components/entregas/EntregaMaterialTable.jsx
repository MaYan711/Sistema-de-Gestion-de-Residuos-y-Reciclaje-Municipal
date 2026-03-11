function badgeClass(alerta) {
  if (!alerta) return "bg-success";
  if (alerta.nivel === "temprana") return "bg-warning text-dark";
  if (alerta.nivel === "urgente") return "bg-danger";
  if (alerta.nivel === "critica") return "bg-dark";
  return "bg-secondary";
}

function EntregaMaterialTable({ entregas }) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h5 className="mb-0">Historial de entregas</h5>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Ciudadano</th>
                <th>Contenedor</th>
                <th>Punto verde</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Nivel actual</th>
                <th>Alerta</th>
              </tr>
            </thead>
            <tbody>
              {entregas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No hay entregas registradas
                  </td>
                </tr>
              ) : (
                entregas.map((item) => (
                  <tr key={item.id_entrega}>
                    <td>{item.id_entrega}</td>
                    <td>{item.fecha_entrega}</td>
                    <td>{item.ciudadano_nombre || "Sin ciudadano"}</td>
                    <td>{item.contenedor_codigo}</td>
                    <td>{item.punto_verde_nombre}</td>
                    <td>{item.tipo_material_nombre}</td>
                    <td>{Number(item.cantidad_kg).toFixed(2)} kg</td>
                    <td>{Number(item.contenedor_nivel_llenado).toFixed(2)}%</td>
                    <td>
                      <span className={`badge ${badgeClass(item.alerta)}`}>
                        {item.alerta?.mensaje || "Normal"}
                      </span>
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

export default EntregaMaterialTable;