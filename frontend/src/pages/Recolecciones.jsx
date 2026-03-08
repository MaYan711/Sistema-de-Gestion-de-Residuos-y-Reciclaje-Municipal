import { useEffect, useState } from "react";
import AppMessage from "../components/common/AppMessage";
import RecoleccionForm from "../components/recolecciones/RecoleccionForm";
import RecoleccionTable from "../components/recolecciones/RecoleccionTable";
import {
  createRecoleccion,
  deleteRecoleccion,
  getAsignacionesDisponiblesRecoleccion,
  getRecolecciones,
  updateRecoleccion,
} from "../api/recolecciones.service";

export default function Recolecciones() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [recolecciones, setRecolecciones] = useState([]);
  const [recoleccionEditando, setRecoleccionEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: "",
    id_asignacion: "",
  });

  const mostrarMensaje = (texto, tipo = "success") => {
    setMessage(texto);
    setMessageType(tipo);
  };

  const limpiarMensaje = () => {
    setMessage("");
  };

  const cargarAsignaciones = async () => {
    const data = await getAsignacionesDisponiblesRecoleccion();
    setAsignaciones(data);
  };

  const cargarRecolecciones = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filtros.estado) params.estado = filtros.estado;
      if (filtros.id_asignacion) params.id_asignacion = filtros.id_asignacion;

      const data = await getRecolecciones(params);
      setRecolecciones(data);
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudieron cargar las recolecciones", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await cargarAsignaciones();
      await cargarRecolecciones();
    };

    init();
  }, []);

  const handleGuardar = async (payload) => {
    setLoading(true);
    limpiarMensaje();

    try {
      if (recoleccionEditando) {
        await updateRecoleccion(recoleccionEditando.id_recoleccion, payload);
        mostrarMensaje("Recolección actualizada exitosamente", "success");
      } else {
        await createRecoleccion(payload);
        mostrarMensaje("Recolección registrada exitosamente", "success");
      }

      setRecoleccionEditando(null);
      await cargarRecolecciones();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      const errores = error?.response?.data?.errors;
      if (errores) {
        const primerCampo = Object.keys(errores)[0];
        const primerMensaje = errores[primerCampo]?.[0];
        mostrarMensaje(primerMensaje || "Ocurrió un error al guardar la recolección", "danger");
      } else {
        mostrarMensaje("Ocurrió un error al guardar la recolección", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (recoleccion) => {
    setRecoleccionEditando(recoleccion);
    setAccionPendiente(null);
    limpiarMensaje();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setRecoleccionEditando(null);
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
      await deleteRecoleccion(accionPendiente.id);
      mostrarMensaje("Recolección eliminada exitosamente", "warning");
      setAccionPendiente(null);
      await cargarRecolecciones();
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudo eliminar la recolección", "danger");
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
    await cargarRecolecciones();
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Proceso de recolección</h2>
        <p className="text-muted mb-0">
          Control operativo del recorrido, estado y observaciones
        </p>
      </div>

      <AppMessage
        message={message}
        type={messageType}
        onClose={limpiarMensaje}
      />

      {accionPendiente && (
        <div className="alert alert-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>¿Deseas eliminar esta recolección?</span>

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

      <RecoleccionForm
        asignaciones={asignaciones}
        recoleccionEditando={recoleccionEditando}
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
            <div className="col-md-5">
              <label className="form-label">Asignación</label>
              <select
                name="id_asignacion"
                className="form-select"
                value={filtros.id_asignacion}
                onChange={handleFiltroChange}
              >
                <option value="">Todas</option>
                {asignaciones.map((asignacion) => (
                  <option key={asignacion.id_asignacion} value={asignacion.id_asignacion}>
                    #{asignacion.id_asignacion} - {asignacion.ruta?.nombre} - {asignacion.camion?.placa}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-5">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={filtros.estado}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="programada">Programada</option>
                <option value="en_proceso">En proceso</option>
                <option value="completada">Completada</option>
                <option value="incompleta">Incompleta</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Filtrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <RecoleccionTable
        recolecciones={recolecciones}
        onEdit={handleEditar}
        onDelete={solicitarEliminar}
        loading={loading}
      />
    </div>
  );
}