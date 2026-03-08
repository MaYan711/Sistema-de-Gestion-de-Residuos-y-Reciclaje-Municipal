export default function PortalRutaList({ rutas, rutaSeleccionada, onSeleccionar }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Rutas disponibles</h5>
      </div>

      <div className="card-body">
        {rutas.length === 0 ? (
          <p className="mb-0 text-muted">No hay rutas disponibles con esos filtros.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {rutas.map((ruta) => {
              const activa = rutaSeleccionada?.id_ruta === ruta.id_ruta;

              return (
                <button
                  key={ruta.id_ruta}
                  type="button"
                  className={`btn text-start ${activa ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => onSeleccionar(ruta)}
                >
                  <div className="fw-bold">{ruta.nombre}</div>
                  <div>Zona: {ruta.zona?.nombre ?? "—"}</div>
                  <div>Días: {ruta.dias_recole}</div>
                  <div>Horario: {ruta.horario}</div>
                  <div>Residuo: {ruta.tipo_residuo}</div>
                  <div>Distancia: {ruta.distancia} km</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}