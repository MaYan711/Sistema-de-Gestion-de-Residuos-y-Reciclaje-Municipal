import { useEffect, useState } from "react";
import ZonaForm from "../components/zonas/ZonaForm";
import ZonaTable from "../components/zonas/ZonaTable";
import {
  createZona,
  deleteZona,
  getZonas,
  restoreZona,
  updateZona,
} from "../api/zonas.service";

function Zonas() {
  const [zonas, setZonas] = useState([]);
  const [zonaEditando, setZonaEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    buscar: "",
    tipo: "",
    activo: "true",
  });

  const cargarZonas = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filtros.buscar.trim()) params.buscar = filtros.buscar.trim();
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.activo !== "") params.activo = filtros.activo;

      const data = await getZonas(params);
      setZonas(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las zonas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarZonas();
  }, []);

  const handleGuardar = async (payload) => {
    setLoading(true);
    try {
      if (zonaEditando) {
        await updateZona(zonaEditando.id_zona, payload);
        alert("Zona actualizada correctamente");
      } else {
        await createZona(payload);
        alert("Zona creada correctamente");
      }

      setZonaEditando(null);
      await cargarZonas();
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.message || "Ocurrió un error al guardar la zona";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (zona) => {
    setZonaEditando(zona);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setZonaEditando(null);
  };

  const handleDesactivar = async (id) => {
    const confirmado = window.confirm("¿Deseas desactivar esta zona?");
    if (!confirmado) return;

    setLoading(true);
    try {
      await deleteZona(id);
      await cargarZonas();
      alert("Zona desactivada correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo desactivar la zona");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivar = async (id) => {
    setLoading(true);
    try {
      await restoreZona(id);
      await cargarZonas();
      alert("Zona reactivada correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo reactivar la zona");
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
    await cargarZonas();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Gestión de zonas</h2>
          <p className="text-muted mb-0">
            Registro, edición y control de zonas del sistema
          </p>
        </div>
      </div>

      <ZonaForm
        onSubmit={handleGuardar}
        zonaEditando={zonaEditando}
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
              <label className="form-label">Buscar por nombre</label>
              <input
                type="text"
                name="buscar"
                className="form-control"
                value={filtros.buscar}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Tipo</label>
              <select
                name="tipo"
                className="form-select"
                value={filtros.tipo}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div className="col-md-4">
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

      <ZonaTable
        zonas={zonas}
        onEdit={handleEditar}
        onDelete={handleDesactivar}
        onRestore={handleReactivar}
        loading={loading}
      />
    </div>
  );
}

export default Zonas;