import { useEffect, useState } from "react";
import { getZonas } from "../api/zonas.service";
import {
  createRuta,
  deleteRuta,
  getRutas,
  restoreRuta,
  updateRuta,
} from "../api/rutas.service";
import RutaForm from "../components/rutas/RutaForm";
import RutaTable from "../components/rutas/RutaTable";
import AppMessage from "../components/common/AppMessage";

function Rutas() {
  const [zonas, setZonas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [rutaEditando, setRutaEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [filtros, setFiltros] = useState({
    buscar: "",
    id_zona: "",
    tipo_residuo: "",
    activo: "true",
  });

  const mostrarMensaje = (texto, tipo = "success") => {
    setMessage(texto);
    setMessageType(tipo);
  };

  const limpiarMensaje = () => {
    setMessage("");
  };

  const cargarZonas = async () => {
    const data = await getZonas({ activo: true });
    setZonas(data);
  };

  const cargarRutas = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filtros.buscar.trim()) params.buscar = filtros.buscar.trim();
      if (filtros.id_zona) params.id_zona = filtros.id_zona;
      if (filtros.tipo_residuo) params.tipo_residuo = filtros.tipo_residuo;
      if (filtros.activo !== "") params.activo = filtros.activo;

      const data = await getRutas(params);
      setRutas(data);
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudieron cargar las rutas", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await cargarZonas();
        await cargarRutas();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const handleGuardar = async (payload) => {
    setLoading(true);
    limpiarMensaje();

    try {
      if (rutaEditando) {
        await updateRuta(rutaEditando.id_ruta, payload);
        mostrarMensaje("Ruta modificada exitosamente", "success");
      } else {
        await createRuta(payload);
        mostrarMensaje("Ruta registrada exitosamente", "success");
      }

      setRutaEditando(null);
      await cargarRutas();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      const errores = error?.response?.data?.errors;
      if (errores) {
        const primerCampo = Object.keys(errores)[0];
        const primerMensaje = errores[primerCampo]?.[0];
        mostrarMensaje(primerMensaje || "Ocurrió un error al guardar la ruta", "danger");
      } else {
        mostrarMensaje("Ocurrió un error al guardar la ruta", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (ruta) => {
    setRutaEditando(ruta);
    setAccionPendiente(null);
    limpiarMensaje();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setRutaEditando(null);
  };

  const solicitarDesactivar = (id) => {
    setAccionPendiente({ tipo: "desactivar", id });
    limpiarMensaje();
  };

  const solicitarReactivar = (id) => {
    setAccionPendiente({ tipo: "reactivar", id });
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
      if (accionPendiente.tipo === "desactivar") {
        await deleteRuta(accionPendiente.id);
        mostrarMensaje("Ruta desactivada exitosamente", "warning");
      }

      if (accionPendiente.tipo === "reactivar") {
        await restoreRuta(accionPendiente.id);
        mostrarMensaje("Ruta reactivada exitosamente", "success");
      }

      setAccionPendiente(null);
      await cargarRutas();
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudo completar la acción", "danger");
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
    await cargarRutas();
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Gestión de rutas</h2>
        <p className="text-muted mb-0">
          Registro, edición y control de rutas de recolección
        </p>
      </div>

      <AppMessage
        message={message}
        type={messageType}
        onClose={limpiarMensaje}
      />

      {accionPendiente && (
        <div className="alert alert-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>
            {accionPendiente.tipo === "desactivar"
              ? "¿Deseas desactivar esta ruta?"
              : "¿Deseas reactivar esta ruta?"}
          </span>

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

      <RutaForm
        zonas={zonas}
        rutaEditando={rutaEditando}
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
            <div className="col-md-3">
              <label className="form-label">Buscar por nombre</label>
              <input
                type="text"
                name="buscar"
                className="form-control"
                value={filtros.buscar}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Zona</label>
              <select
                name="id_zona"
                className="form-select"
                value={filtros.id_zona}
                onChange={handleFiltroChange}
              >
                <option value="">Todas</option>
                {zonas.map((zona) => (
                  <option key={zona.id_zona} value={zona.id_zona}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Tipo de residuo</label>
              <select
                name="tipo_residuo"
                className="form-select"
                value={filtros.tipo_residuo}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="organico">Orgánico</option>
                <option value="inorganico">Inorgánico</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Estado</label>
              <select
                name="activo"
                className="form-select"
                value={filtros.activo}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="true">Activas</option>
                <option value="false">Inactivas</option>
              </select>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Filtrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <RutaTable
        rutas={rutas}
        onEdit={handleEditar}
        onDelete={solicitarDesactivar}
        onRestore={solicitarReactivar}
        loading={loading}
      />
    </div>
  );
}

export default Rutas;