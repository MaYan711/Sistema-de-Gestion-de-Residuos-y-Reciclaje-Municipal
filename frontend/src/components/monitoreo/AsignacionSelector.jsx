export default function AsignacionSelector({
  asignaciones,
  asignacionSeleccionada,
  onSeleccionar,
  loading,
}) {
  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Asignaciones</h5>
      </div>

      <div className="card-body">
        {loading && asignaciones.length === 0 ? (
          <p className="mb-0">Cargando asignaciones...</p>
        ) : asignaciones.length === 0 ? (
          <p className="mb-0 text-muted">No hay asignaciones registradas.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {asignaciones.map((asignacion) => {
              const activa =
                asignacionSeleccionada?.id_asignacion === asignacion.id_asignacion;

              return (
                <button
                  key={asignacion.id_asignacion}
                  type="button"
                  className={`btn text-start ${activa ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => onSeleccionar(asignacion.id_asignacion)}
                >
                  <div className="fw-bold">
                    Asignación #{asignacion.id_asignacion}
                  </div>
                  <div>Ruta: {asignacion.ruta?.nombre ?? "—"}</div>
                  <div>Zona: {asignacion.ruta?.zona?.nombre ?? "—"}</div>
                  <div>Camión: {asignacion.camion?.placa ?? "—"}</div>
                  <div>Fecha: {asignacion.fecha_asig}</div>
                  <div>Peso estimado: {asignacion.peso_estimado} kg</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}