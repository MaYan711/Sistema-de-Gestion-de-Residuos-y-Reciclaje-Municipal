import { useEffect, useState } from "react";

const initialState = {
  id_rol: "",
  nombre: "",
  email: "",
  password: "",
  telefono: "",
  activo: true,
};

function UsuarioForm({ roles, usuarioEditando, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (usuarioEditando) {
      setForm({
        id_rol: usuarioEditando.id_rol || "",
        nombre: usuarioEditando.nombre || "",
        email: usuarioEditando.email || "",
        password: "",
        telefono: usuarioEditando.telefono || "",
        activo: Boolean(usuarioEditando.activo),
      });
    } else {
      setForm(initialState);
    }
  }, [usuarioEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id_rol: Number(form.id_rol),
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      activo: Boolean(form.activo),
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    onSubmit(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">
          {usuarioEditando ? "Editar usuario" : "Crear usuario"}
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Rol</label>
            <select
              name="id_rol"
              className="form-select"
              value={form.id_rol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              {usuarioEditando ? "Nueva contraseña" : "Contraseña"}
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required={!usuarioEditando}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              name="telefono"
              className="form-control"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                id="activoUsuario"
              />
              <label className="form-check-label" htmlFor="activoUsuario">
                Usuario activo
              </label>
            </div>
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" disabled={loading}>
              {loading
                ? "Guardando..."
                : usuarioEditando
                ? "Actualizar usuario"
                : "Crear usuario"}
            </button>

            {usuarioEditando && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsuarioForm;