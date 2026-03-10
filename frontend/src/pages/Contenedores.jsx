import { useEffect, useState } from "react";
import ContenedorForm from "../components/contenedores/ContenedorForm";
import ContenedorTable from "../components/contenedores/ContenedorTable";
import {
  createContenedor,
  deleteContenedor,
  getContenedores,
  restoreContenedor,
  updateContenedor,
} from "../api/contenedores.service";
import { getPuntosVerdes } from "../api/puntos-verdes.service";
import { getTiposMaterial } from "../api/tipos-material.service";

function Contenedores() {
  const [contenedores, setContenedores] = useState([]);
  const [puntosVerdes, setPuntosVerdes] = useState([]);
  const [tiposMaterial, setTiposMaterial] = useState([]);
  const [contenedorEditando, setContenedorEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    buscar: "",
    activo: "true",
    id_punto_verde: "",
    id_tipo_material: "",
    estado: "",
  });

    const cargarCatalogos = async () => {
      const [puntos, tipos] = await Promise.all([
        getPuntosVerdes(),
        getTiposMaterial({ activo: true }),
      ]);

      setPuntosVerdes(Array.isArray(puntos) ? puntos : []);
      setTiposMaterial(Array.isArray(tipos) ? tipos : []);
    };
  const cargarContenedores = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filtros.buscar.trim()) params.buscar = filtros.buscar.trim();
      if (filtros.activo !== "") params.activo = filtros.activo;
      if (filtros.id_punto_verde) params.id_punto_verde = filtros.id_punto_verde;
      if (filtros.id_tipo_material) params.id_tipo_material = filtros.id_tipo_material;
      if (filtros.estado) params.estado = filtros.estado;

      const data = await getContenedores(params);
      setContenedores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los contenedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await cargarCatalogos();
        await cargarContenedores();
      } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los datos iniciales");
      }
    };

    init();
  }, []);

  const handleGuardar = async (payload) => {
    setLoading(true);
    try {
      if (contenedorEditando) {
        await updateContenedor(contenedorEditando.id_contenedor, payload);
        alert("Contenedor actualizado correctamente");
      } else {
        await createContenedor(payload);
        alert("Contenedor creado correctamente");
      }

      setContenedorEditando(null);
      await cargarContenedores();
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.nivel_llenado?.[0] ||
        error?.response?.data?.errors?.codigo?.[0] ||
        "Ocurrió un error al guardar el contenedor";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (contenedor) => {
    setContenedorEditando(contenedor);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setContenedorEditando(null);
  };

  const handleDesactivar = async (id) => {
    const confirmado = window.confirm("¿Deseas desactivar este contenedor?");
    if (!confirmado) return;

    setLoading(true);
    try {
      await deleteContenedor(id);
      await cargarContenedores();
      alert("Contenedor desactivado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo desactivar el contenedor");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivar = async (id) => {
    setLoading(true);
    try {
      await restoreContenedor(id);
      await cargarContenedores();
      alert("Contenedor reactivado correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo reactivar el contenedor");
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
    await cargarContenedores();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Gestión de contenedores</h2>
          <p className="text-muted mb-0">
            Registro, edición y control de contenedores por punto verde y tipo de material
          </p>
        </div>
      </div>

      <ContenedorForm
        onSubmit={handleGuardar}
        contenedorEditando={contenedorEditando}
        onCancel={handleCancelar}
        loading={loading}
        puntosVerdes={puntosVerdes}
        tiposMaterial={tiposMaterial}
      />

      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Filtros</h5>
        </div>

        <div className="card-body">
          <form className="row g-3" onSubmit={handleBuscar}>
            <div className="col-md-3">
              <label className="form-label">Buscar por código</label>
              <input
                type="text"
                name="buscar"
                className="form-control"
                value={filtros.buscar}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Activo</label>
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

            <div className="col-md-2">
              <label className="form-label">Punto verde</label>
              <select
                name="id_punto_verde"
                className="form-select"
                value={filtros.id_punto_verde}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                {puntosVerdes.map((punto) => (
                  <option key={punto.id_punto_verde} value={punto.id_punto_verde}>
                    {punto.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Tipo material</label>
              <select
                name="id_tipo_material"
                className="form-select"
                value={filtros.id_tipo_material}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                {tiposMaterial.map((tipo) => (
                  <option key={tipo.id_tipo} value={tipo.id_tipo}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={filtros.estado}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="lleno">Lleno</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Filtrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <ContenedorTable
        contenedores={contenedores}
        onEdit={handleEditar}
        onDelete={handleDesactivar}
        onRestore={handleReactivar}
        loading={loading}
      />
    </div>
  );
}

export default Contenedores;