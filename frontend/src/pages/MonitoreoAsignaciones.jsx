import { useEffect, useState } from "react";
import AsignacionMap from "../components/monitoreo/AsignacionMap";
import AsignacionSelector from "../components/monitoreo/AsignacionSelector";
import PuntosRecoleccionTable from "../components/monitoreo/PuntosRecoleccionTable";
import {
  getAsignacionDetalleMonitoreo,
  getAsignacionesMonitoreo,
} from "../api/monitoreo-rutas.service";
import {
  marcarPuntoPendiente,
  marcarPuntoRecolectado,
} from "../api/puntos-recoleccion.service";
import AppMessage from "../components/common/AppMessage";

export default function MonitoreoAsignaciones() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [filtros, setFiltros] = useState({
    fecha_asig: "",
    id_ruta: "",
    id_camion: "",
  });

  const mostrarMensaje = (texto, tipo = "success") => {
    setMessage(texto);
    setMessageType(tipo);
  };

  const limpiarMensaje = () => {
    setMessage("");
  };

  const cargarAsignaciones = async () => {
    setLoading(true);

    try {
      const params = {};

      if (filtros.fecha_asig) params.fecha_asig = filtros.fecha_asig;
      if (filtros.id_ruta) params.id_ruta = filtros.id_ruta;
      if (filtros.id_camion) params.id_camion = filtros.id_camion;

      const data = await getAsignacionesMonitoreo(params);
      setAsignaciones(data);

      if (data.length > 0) {
        const detalle = await getAsignacionDetalleMonitoreo(data[0].id_asignacion);
        setAsignacionSeleccionada(detalle);
      } else {
        setAsignacionSeleccionada(null);
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudieron cargar las asignaciones", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAsignaciones();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    await cargarAsignaciones();
  };

  const handleSeleccionar = async (id) => {
    try {
      limpiarMensaje();
      const detalle = await getAsignacionDetalleMonitoreo(id);
      setAsignacionSeleccionada(detalle);
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudo cargar el detalle de la asignación", "danger");
    }
  };

  const refrescarAsignacionSeleccionada = async () => {
    if (!asignacionSeleccionada?.id_asignacion) return;
    const detalle = await getAsignacionDetalleMonitoreo(asignacionSeleccionada.id_asignacion);
    setAsignacionSeleccionada(detalle);
  };

  const handleMarcarRecolectado = async (idPunto) => {
    try {
      setLoading(true);
      limpiarMensaje();
      await marcarPuntoRecolectado(idPunto);
      await refrescarAsignacionSeleccionada();
      mostrarMensaje("Punto marcado como recolectado correctamente", "success");
    } catch (error) {
      console.error(error);
      const errores = error?.response?.data?.errors;
      if (errores) {
        const primerCampo = Object.keys(errores)[0];
        const primerMensaje = errores[primerCampo]?.[0];
        mostrarMensaje(primerMensaje || "No se pudo marcar el punto", "danger");
      } else {
        mostrarMensaje("No se pudo marcar el punto", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarPendiente = async (idPunto) => {
    try {
      setLoading(true);
      limpiarMensaje();
      await marcarPuntoPendiente(idPunto);
      await refrescarAsignacionSeleccionada();
      mostrarMensaje("Punto marcado como pendiente correctamente", "warning");
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudo actualizar el punto", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Monitoreo de asignaciones</h2>
        <p className="text-muted mb-0">
          Visualización de rutas y puntos dinámicos de recolección generados
        </p>
      </div>

      <AppMessage
        message={message}
        type={messageType}
        onClose={limpiarMensaje}
      />

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Filtros</h5>
        </div>

        <div className="card-body">
          <form className="row g-3" onSubmit={handleBuscar}>
            <div className="col-md-4">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                name="fecha_asig"
                className="form-control"
                value={filtros.fecha_asig}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">ID Ruta</label>
              <input
                type="number"
                name="id_ruta"
                className="form-control"
                value={filtros.id_ruta}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">ID Camión</label>
              <input
                type="number"
                name="id_camion"
                className="form-control"
                value={filtros.id_camion}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Cargando..." : "Filtrar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {asignacionSeleccionada && (
        <div className="card shadow-sm mb-4">
          <div className="card-header">
            <h5 className="mb-0">Detalle de la asignación</h5>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <strong>Asignación:</strong>
                <div>#{asignacionSeleccionada.id_asignacion}</div>
              </div>

              <div className="col-md-3">
                <strong>Ruta:</strong>
                <div>{asignacionSeleccionada.ruta?.nombre ?? "—"}</div>
              </div>

              <div className="col-md-3">
                <strong>Camión:</strong>
                <div>{asignacionSeleccionada.camion?.placa ?? "—"}</div>
              </div>

              <div className="col-md-3">
                <strong>Conductor:</strong>
                <div>{asignacionSeleccionada.camion?.conductor?.nombre ?? "Sin conductor"}</div>
              </div>

              <div className="col-md-3">
                <strong>Fecha:</strong>
                <div>{asignacionSeleccionada.fecha_asig}</div>
              </div>

              <div className="col-md-3">
                <strong>Peso estimado:</strong>
                <div>{asignacionSeleccionada.peso_estimado} kg</div>
              </div>

              <div className="col-md-3">
                <strong>Puntos generados:</strong>
                <div>{asignacionSeleccionada.puntos_recoleccion?.length ?? 0}</div>
              </div>

              <div className="col-md-3">
                <strong>Recolectados:</strong>
                <div>
                  {asignacionSeleccionada.puntos_recoleccion?.filter((p) => p.recolectado).length ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <AsignacionSelector
            asignaciones={asignaciones}
            asignacionSeleccionada={asignacionSeleccionada}
            onSeleccionar={handleSeleccionar}
            loading={loading}
          />
        </div>

        <div className="col-lg-8">
          {asignacionSeleccionada ? (
            <AsignacionMap asignacion={asignacionSeleccionada} />
          ) : (
            <div className="card shadow-sm">
              <div className="card-body">
                <p className="mb-0 text-muted">
                  No hay asignación seleccionada para mostrar en mapa.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {asignacionSeleccionada && (
        <PuntosRecoleccionTable
          puntos={asignacionSeleccionada.puntos_recoleccion ?? []}
          onMarcarRecolectado={handleMarcarRecolectado}
          onMarcarPendiente={handleMarcarPendiente}
          loading={loading}
        />
      )}
    </div>
  );
}