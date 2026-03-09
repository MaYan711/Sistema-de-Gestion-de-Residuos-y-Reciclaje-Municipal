import { useEffect, useState } from "react";
import TipoMaterialForm from "../components/tipos-material/TipoMaterialForm";
import TipoMaterialTable from "../components/tipos-material/TipoMaterialTable";
import {
  createTipoMaterial,
  deleteTipoMaterial,
  getTiposMaterial,
  restoreTipoMaterial,
  updateTipoMaterial,
} from "../api/tipos-material.service";

function TiposMaterial() {
  const [tipos, setTipos] = useState([]);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    buscar: "",
    activo: "true",
  });

  const cargarTipos = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filtros.buscar.trim()) params.buscar = filtros.buscar.trim();
      if (filtros.activo !== "") params.activo = filtros.activo;

      const data = await getTiposMaterial(params);
      setTipos(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los tipos de material");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const handleGuardar = async (payload) => {
    setLoading(true);
    try {
      if (tipoEditando) {
        await updateTipoMaterial(tipoEditando.id_tipo, payload);
        alert("Tipo de material actualizado correctamente");
      } else {
        await createTipoMaterial(payload);
        alert("Tipo de material creado correctamente");
      }

      setTipoEditando(null);
      await cargarTipos();
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.message ||
        "Ocurrió un error al guardar el tipo de material";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (tipo) => {
    setTipoEditando(tipo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setTipoEditando(null);
  };

  const handleDesactivar = async (id) => {
    const confirmado = window.confirm("¿Deseas desactivar este tipo de material?");
    if (!confirmado) return;

    setLoading(true);
    try {
      await deleteTipoMaterial(id);
      await cargarTipos();
      alert("Tipo de material desactivado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo desactivar el tipo de material");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivar = async (id) => {
    setLoading(true);
    try {
      await restoreTipoMaterial(id);
      await cargarTipos();
      alert("Tipo de material reactivado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo reactivar el tipo de material");
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
    await cargarTipos();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Gestión de tipos de material</h2>
          <p className="text-muted mb-0">
            Registro, edición y control de tipos de material reciclable
          </p>
        </div>
      </div>

      <TipoMaterialForm
        onSubmit={handleGuardar}
        tipoEditando={tipoEditando}
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
              />
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
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
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

      <TipoMaterialTable
        tipos={tipos}
        onEdit={handleEditar}
        onDelete={handleDesactivar}
        onRestore={handleReactivar}
        loading={loading}
      />
    </div>
  );
}

export default TiposMaterial;