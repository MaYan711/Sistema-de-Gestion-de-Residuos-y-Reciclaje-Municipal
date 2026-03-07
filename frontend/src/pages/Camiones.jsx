import { useEffect, useState } from "react";
import AppMessage from "../components/common/AppMessage";
import CamionForm from "../components/camiones/CamionForm";
import CamionTable from "../components/camiones/CamionTable";
import {
  createCamion,
  deleteCamion,
  getCamiones,
  getConductoresCamion,
  updateCamion,
} from "../api/camiones.service";

export default function Camiones() {
  const [camiones, setCamiones] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [camionEditando, setCamionEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [filtros, setFiltros] = useState({
    buscar: "",
    estado: "",
  });

  const mostrarMensaje = (texto, tipo = "success") => {
    setMessage(texto);
    setMessageType(tipo);
  };

  const limpiarMensaje = () => {
    setMessage("");
  };

  const cargarCamiones = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filtros.buscar.trim()) params.buscar = filtros.buscar.trim();
      if (filtros.estado) params.estado = filtros.estado;

      const data = await getCamiones(params);
      setCamiones(data);
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudieron cargar los camiones", "danger");
    } finally {
      setLoading(false);
    }
  };

  const cargarConductores = async () => {
    try {
      const data = await getConductoresCamion();
      setConductores(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await cargarConductores();
      await cargarCamiones();
    };

    init();
  }, []);

  const handleGuardar = async (payload) => {
    setLoading(true);
    limpiarMensaje();

    try {
      if (camionEditando) {
        await updateCamion(camionEditando.id_camion, payload);
        mostrarMensaje("Camión actualizado exitosamente", "success");
      } else {
        await createCamion(payload);
        mostrarMensaje("Camión registrado exitosamente", "success");
      }

      setCamionEditando(null);
      await cargarCamiones();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      const errores = error?.response?.data?.errors;
      if (errores) {
        const primerCampo = Object.keys(errores)[0];
        const primerMensaje = errores[primerCampo]?.[0];
        mostrarMensaje(primerMensaje || "Ocurrió un error al guardar el camión", "danger");
      } else {
        mostrarMensaje("Ocurrió un error al guardar el camión", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (camion) => {
    setCamionEditando(camion);
    setAccionPendiente(null);
    limpiarMensaje();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setCamionEditando(null);
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
      await deleteCamion(accionPendiente.id);
      mostrarMensaje("Camión inactivado exitosamente", "warning");
      setAccionPendiente(null);
      await cargarCamiones();
    } catch (error) {
      console.error(error);
      mostrarMensaje("No se pudo inactivar el camión", "danger");
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
    await cargarCamiones();
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Gestión de camiones</h2>
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
          <span>¿Deseas inactivar este camión?</span>

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

      <CamionForm
        camionEditando={camionEditando}
        conductores={conductores}
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
            <div className="col-md-6">
              <label className="form-label">Buscar</label>
              <input
                type="text"
                name="buscar"
                className="form-control"
                value={filtros.buscar}
                onChange={handleFiltroChange}
                placeholder="Placa, marca o modelo"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={filtros.estado}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="operativo">Operativo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="fuera_servicio">Fuera de servicio</option>
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

      <CamionTable
        camiones={camiones}
        onEdit={handleEditar}
        onDelete={solicitarEliminar}
        loading={loading}
      />
    </div>
  );
}