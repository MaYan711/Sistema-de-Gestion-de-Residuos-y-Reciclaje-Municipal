import { useEffect, useState } from "react";
import {
  createUsuario,
  getRolesUsuarios,
  getUsuarios,
  toggleActivoUsuario,
  updateUsuario,
} from "../api/usuarios.service";
import UsuarioForm from "../components/usuarios/UsuarioForm";
import UsuarioTable from "../components/usuarios/UsuarioTable";

function Usuarios() {
  const [roles, setRoles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarRoles = async () => {
    try {
      const data = await getRolesUsuarios();
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los roles");
    }
  };

  const cargarUsuarios = async (idRol = filtroRol) => {
    try {
      const data = await getUsuarios(idRol);
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    cargarRoles();
    cargarUsuarios("");
  }, []);

  const handleFiltrar = async () => {
    await cargarUsuarios(filtroRol);
  };

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      if (usuarioEditando) {
        await updateUsuario(usuarioEditando.id_usuario, payload);
        alert("Usuario actualizado correctamente");
      } else {
        await createUsuario(payload);
        alert("Usuario creado correctamente");
      }

      setUsuarioEditando(null);
      await cargarUsuarios(filtroRol);
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.errors?.email?.[0] ||
        error?.response?.data?.errors?.password?.[0] ||
        error?.response?.data?.message ||
        "No se pudo guardar el usuario";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioEditando(usuario);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarEdicion = () => {
    setUsuarioEditando(null);
  };

  const handleToggleActivo = async (usuario) => {
    const confirmado = window.confirm(
      `¿Deseas ${usuario.activo ? "desactivar" : "activar"} este usuario?`
    );

    if (!confirmado) return;

    setLoading(true);
    try {
      await toggleActivoUsuario(usuario.id_usuario);
      await cargarUsuarios(filtroRol);
      alert("Estado del usuario actualizado correctamente");
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.message ||
        "No se pudo actualizar el estado del usuario";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Gestión de Usuarios</h2>
        <p className="text-muted mb-0">
          Administración de usuarios y roles del sistema
        </p>
      </div>

      <UsuarioForm
        roles={roles}
        usuarioEditando={usuarioEditando}
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={handleCancelarEdicion}
      />

      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Filtros</h5>
        </div>

        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Filtrar por rol</label>
              <select
                className="form-select"
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <option value="">Todos</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button className="btn btn-dark w-100" onClick={handleFiltrar}>
                Aplicar filtro
              </button>
            </div>
          </div>
        </div>
      </div>

      <UsuarioTable
        usuarios={usuarios}
        onEdit={handleEditar}
        onToggleActivo={handleToggleActivo}
        loading={loading}
      />
    </div>
  );
}

export default Usuarios;