import { useEffect, useState } from "react";
import AppMessage from "../components/common/AppMessage";
import AsignacionForm from "../components/asignaciones/AsignacionForm";
import AsignacionTable from "../components/asignaciones/AsignacionTable";
import {
  createAsignacionRuta,
  deleteAsignacionRuta,
  getAsignacionesRuta,
  getCamionesDisponiblesAsignacion,
  getRutasDisponiblesAsignacion,
  updateAsignacionRuta,
} from "../api/asignaciones.service";

export default function AsignacionesRuta() {
  const [rutas, setRutas] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionEditando, setAsignacionEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [filtros, setFiltros] = useState({
    id_ruta: "",
    id_camion: "",
    fecha_asig: "",
  });

  const mostrarMensaje = (texto, tipo = "success") => {
    setMessage(texto);
    setMessageType(tipo);
  };

  const limpiarMensaje = () => {
    setMessage("");
  };

  const cargarCatalogos = async () => {
    const [rutasData, camionesData] = await Promise.all([
      getRutasDisponiblesAsignacion(),
      getCamionesDisponiblesAsignacion(),
    ]);

    setRutas(rutasData);
    setCamiones(camionesData);
  };

  const cargarAsignaciones = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filtros.id_ruta) params.id_ruta = filtros.id_ruta;
      if (filtros.id_camion) params.id_camion = filtros.id_camion;
      if (filtros.fecha_asig) params.fecha_asig = filtros.fecha_asig;

      const data = await getAsignacionesRuta(params);
      setAsignaciones(data);
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudieron cargar las asignaciones", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await cargarCatalogos();
      await cargarAsignaciones();
    };

    init();
  }, []);

  const handleGuardar = async (payload) => {
    setLoading(true);
    limpiarMensaje();

    try {
      if (asignacionEditando) {
        const resp = await updateAsignacionRuta(asignacionEditando.id_asignacion, payload);
        const cantidad = resp?.asignacion?.puntos_recoleccion?.length ?? 0;
        mostrarMensaje(`Asignación actualizada exitosamente. Se generaron ${cantidad} puntos de recolección.`, "success");
        } else {
        const resp = await createAsignacionRuta(payload);
        const cantidad = resp?.asignacion?.puntos_recoleccion?.length ?? 0;
        mostrarMensaje(`Asignación registrada exitosamente. Se generaron ${cantidad} puntos de recolección.`, "success");
        }

      setAsignacionEditando(null);
      await cargarAsignaciones();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      const errores = error?.response?.data?.errors;
      if (errores) {
        const primerCampo = Object.keys(errores)[0];
        const primerMensaje = errores[primerCampo]?.[0];
        mostrarMensaje(primerMensaje || "Ocurrió un error al guardar la asignación", "danger");
      } else {
        mostrarMensaje("Ocurrió un error al guardar la asignación", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (asignacion) => {
    setAsignacionEditando(asignacion);
    setAccionPendiente(null);
    limpiarMensaje();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setAsignacionEditando(null);
  };

  const solicitarEliminar = (id) => {
    setAccionPendiente({ tipo: "eliminar", id });
    limpiarMensaje();
  };

  const cancelarAccion = () => {
    setAccionPendiente(null);
  };

  const confirmarAccion = async () => {
    if (!accionPendiente) return;

    setLoading(true);
    limpiarMensaje();

    try {
      await deleteAsignacionRuta(accionPendiente.id);
      mostrarMensaje("Asignación eliminada exitosamente", "warning");
      setAccionPendiente(null);
      await cargarAsignaciones();
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudo eliminar la asignación", "danger");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Asignacion de camiones a rutas</h2>
        <p className="text-muted mb-0">
          
        </p>
      </div>

      <AppMessage
        message={message}
        type={messageType}
        onClose={limpiarMensaje}
      />

      {accionPendiente && (
        <div className="alert alert-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>¿Deseas eliminar esta asignación?</span>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={confirmarAccion}
              disabled={loading}
            >
              Confirmar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={cancelarAccion}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <AsignacionForm
        rutas={rutas}
        camiones={camiones}
        asignacionEditando={asignacionEditando}
        onSubmit={handleGuardar}
        onCancel={handleCancelar}
        loading={loading}
      />

      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Filtros</h5>
        </div>

        <div className="card-body">
          <form className="row g-3" onSubmit={handleBuscar}>
            <div className="col-md-4">
              <label className="form-label">Ruta</label>
              <select
                name="id_ruta"
                className="form-select"
                value={filtros.id_ruta}
                onChange={handleFiltroChange}
              >
                <option value="">Todas</option>
                {rutas.map((ruta) => (
                  <option key={ruta.id_ruta} value={ruta.id_ruta}>
                    {ruta.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Camión</label>
              <select
                name="id_camion"
                className="form-select"
                value={filtros.id_camion}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                {camiones.map((camion) => (
                  <option key={camion.id_camion} value={camion.id_camion}>
                    {camion.placa}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                name="fecha_asig"
                className="form-control"
                value={filtros.fecha_asig}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Filtrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <AsignacionTable
        asignaciones={asignaciones}
        onEdit={handleEditar}
        onDelete={solicitarEliminar}
        loading={loading}
      />
    </div>
  );
}