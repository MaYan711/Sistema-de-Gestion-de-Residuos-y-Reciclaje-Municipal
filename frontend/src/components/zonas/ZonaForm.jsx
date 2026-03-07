import { useEffect, useState } from "react";

const initialForm = {
  nombre: "",
  tipo: "residencial",
  densidad_pobla: "",
  activo: true,
  latitud_centro: "",
  longitud_centro: "",
};

function ZonaForm({ onSubmit, zonaEditando, onCancel, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (zonaEditando) {
      setForm({
        nombre: zonaEditando.nombre ?? "",
        tipo: zonaEditando.tipo ?? "residencial",
        densidad_pobla: zonaEditando.densidad_pobla ?? "",
        activo: zonaEditando.activo ?? true,
        latitud_centro: zonaEditando.latitud_centro ?? "",
        longitud_centro: zonaEditando.longitud_centro ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [zonaEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.tipo.trim()) nuevosErrores.tipo = "El tipo es obligatorio";

    if (form.densidad_pobla === "" || Number(form.densidad_pobla) < 0) {
      nuevosErrores.densidad_pobla = "La densidad debe ser mayor o igual a 0";
    }

    if (form.latitud_centro !== "") {
      const lat = Number(form.latitud_centro);
      if (Number.isNaN(lat) || lat < -90 || lat > 90) {
        nuevosErrores.latitud_centro = "La latitud debe estar entre -90 y 90";
      }
    }

    if (form.longitud_centro !== "") {
      const lng = Number(form.longitud_centro);
      if (Number.isNaN(lng) || lng < -180 || lng > 180) {
        nuevosErrores.longitud_centro = "La longitud debe estar entre -180 y 180";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      densidad_pobla: Number(form.densidad_pobla),
      activo: form.activo,
      latitud_centro:
        form.latitud_centro === "" ? null : Number(form.latitud_centro),
      longitud_centro:
        form.longitud_centro === "" ? null : Number(form.longitud_centro),
    };

    await onSubmit(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">
          {zonaEditando ? "Editar zona" : "Registrar zona"}
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                value={form.nombre}
                onChange={handleChange}
              />
              {errores.nombre && (
                <div className="invalid-feedback">{errores.nombre}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Tipo</label>
              <select
                name="tipo"
                className={`form-select ${errores.tipo ? "is-invalid" : ""}`}
                value={form.tipo}
                onChange={handleChange}
              >
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
              </select>
              {errores.tipo && (
                <div className="invalid-feedback">{errores.tipo}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Densidad poblacional</label>
              <input
                type="number"
                step="0.01"
                name="densidad_pobla"
                className={`form-control ${errores.densidad_pobla ? "is-invalid" : ""}`}
                value={form.densidad_pobla}
                onChange={handleChange}
              />
              {errores.densidad_pobla && (
                <div className="invalid-feedback">{errores.densidad_pobla}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Latitud centro</label>
              <input
                type="number"
                step="any"
                name="latitud_centro"
                className={`form-control ${errores.latitud_centro ? "is-invalid" : ""}`}
                value={form.latitud_centro}
                onChange={handleChange}
              />
              {errores.latitud_centro && (
                <div className="invalid-feedback">{errores.latitud_centro}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Longitud centro</label>
              <input
                type="number"
                step="any"
                name="longitud_centro"
                className={`form-control ${errores.longitud_centro ? "is-invalid" : ""}`}
                value={form.longitud_centro}
                onChange={handleChange}
              />
              {errores.longitud_centro && (
                <div className="invalid-feedback">{errores.longitud_centro}</div>
              )}
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  id="activo"
                  type="checkbox"
                  name="activo"
                  className="form-check-input"
                  checked={form.activo}
                  onChange={handleChange}
                />
                <label htmlFor="activo" className="form-check-label">
                  Activa
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : zonaEditando ? "Actualizar" : "Guardar"}
            </button>

            {zonaEditando && (
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

export default ZonaForm;