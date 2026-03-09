import { useEffect, useState } from "react";

const initialForm = {
  nombre: "",
  descripcion: "",
  unidad_medida: "",
  activo: true,
};

function TipoMaterialForm({ onSubmit, tipoEditando, onCancel, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (tipoEditando) {
      setForm({
        nombre: tipoEditando.nombre ?? "",
        descripcion: tipoEditando.descripcion ?? "",
        unidad_medida: tipoEditando.unidad_medida ?? "",
        activo: tipoEditando.activo ?? true,
      });
    } else {
      setForm(initialForm);
    }
  }, [tipoEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!form.unidad_medida.trim()) {
      nuevosErrores.unidad_medida = "La unidad de medida es obligatoria";
    }

    if (form.descripcion && form.descripcion.length > 200) {
      nuevosErrores.descripcion = "La descripción no puede exceder 200 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      unidad_medida: form.unidad_medida.trim(),
      activo: form.activo,
    };

    await onSubmit(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">
          {tipoEditando ? "Editar tipo de material" : "Registrar tipo de material"}
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
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

            <div className="col-md-4">
              <label className="form-label">Unidad de medida</label>
              <input
                type="text"
                name="unidad_medida"
                className={`form-control ${errores.unidad_medida ? "is-invalid" : ""}`}
                value={form.unidad_medida}
                onChange={handleChange}
              />
              {errores.unidad_medida && (
                <div className="invalid-feedback">{errores.unidad_medida}</div>
              )}
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check mb-2">
                <input
                  id="activo"
                  type="checkbox"
                  name="activo"
                  className="form-check-input"
                  checked={form.activo}
                  onChange={handleChange}
                />
                <label htmlFor="activo" className="form-check-label">
                  Activo
                </label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                rows="3"
                className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
                value={form.descripcion}
                onChange={handleChange}
              />
              {errores.descripcion && (
                <div className="invalid-feedback">{errores.descripcion}</div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : tipoEditando ? "Actualizar" : "Guardar"}
            </button>

            {tipoEditando && (
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

export default TipoMaterialForm;