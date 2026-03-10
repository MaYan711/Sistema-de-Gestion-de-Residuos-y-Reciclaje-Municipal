import { useEffect, useState } from "react";

const initialForm = {
  id_punto_verde: "",
  id_tipo_material: "",
  codigo: "",
  capacidad_kg: "",
  nivel_llenado: "",
  estado: "disponible",
  ultimo_vaciado: "",
  activo: true,
};

function ContenedorForm({
  onSubmit,
  contenedorEditando,
  onCancel,
  loading,
  puntosVerdes,
  tiposMaterial,
}) {
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (contenedorEditando) {
      setForm({
        id_punto_verde: contenedorEditando.id_punto_verde ?? "",
        id_tipo_material: contenedorEditando.id_tipo_material ?? "",
        codigo: contenedorEditando.codigo ?? "",
        capacidad_kg: contenedorEditando.capacidad_kg ?? "",
        nivel_llenado: contenedorEditando.nivel_llenado ?? "",
        estado: contenedorEditando.estado ?? "disponible",
        ultimo_vaciado: contenedorEditando.ultimo_vaciado
          ? String(contenedorEditando.ultimo_vaciado).slice(0, 16)
          : "",
        activo: contenedorEditando.activo ?? true,
      });
    } else {
      setForm(initialForm);
    }
  }, [contenedorEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.id_punto_verde) {
      nuevosErrores.id_punto_verde = "El punto verde es obligatorio";
    }

    if (!form.id_tipo_material) {
      nuevosErrores.id_tipo_material = "El tipo de material es obligatorio";
    }

    if (!form.codigo.trim()) {
      nuevosErrores.codigo = "El código es obligatorio";
    }

    if (form.capacidad_kg === "" || Number(form.capacidad_kg) <= 0) {
      nuevosErrores.capacidad_kg = "La capacidad debe ser mayor que 0";
    }

    if (form.nivel_llenado === "" || Number(form.nivel_llenado) < 0) {
      nuevosErrores.nivel_llenado = "El nivel de llenado debe ser 0 o mayor";
    }

    if (Number(form.nivel_llenado) > 100) {
      nuevosErrores.nivel_llenado = "El nivel de llenado no puede ser mayor que 100";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    await onSubmit({
      id_punto_verde: Number(form.id_punto_verde),
      id_tipo_material: Number(form.id_tipo_material),
      codigo: form.codigo.trim(),
      capacidad_kg: Number(form.capacidad_kg),
      nivel_llenado: Number(form.nivel_llenado),
      estado: form.estado,
      ultimo_vaciado: form.ultimo_vaciado || null,
      activo: form.activo,
    });
  };

  const puntos = Array.isArray(puntosVerdes) ? puntosVerdes : [];
  const tipos = Array.isArray(tiposMaterial) ? tiposMaterial : [];

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">
          {contenedorEditando ? "Editar contenedor" : "Registrar contenedor"}
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
            <label className="form-label">Punto verde</label>
            <select
              name="id_punto_verde"
              className={`form-select ${errores.id_punto_verde ? "is-invalid" : ""}`}
              value={form.id_punto_verde}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              {puntosVerdes.map((punto) => (
                <option key={punto.id_punto_verde} value={punto.id_punto_verde}>
                  {punto.nombre}
                </option>
              ))}
            </select>
            {errores.id_punto_verde && (
              <div className="invalid-feedback">{errores.id_punto_verde}</div>
            )}
          </div>

            <div className="col-md-6">
              <label className="form-label">Tipo de material</label>
              <select
                name="id_tipo_material"
                className={`form-select ${errores.id_tipo_material ? "is-invalid" : ""}`}
                value={form.id_tipo_material}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id_tipo} value={tipo.id_tipo}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              {errores.id_tipo_material && (
                <div className="invalid-feedback">{errores.id_tipo_material}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Código</label>
              <input
                type="text"
                name="codigo"
                className={`form-control ${errores.codigo ? "is-invalid" : ""}`}
                value={form.codigo}
                onChange={handleChange}
              />
              {errores.codigo && (
                <div className="invalid-feedback">{errores.codigo}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Capacidad kg</label>
              <input
                type="number"
                step="0.01"
                name="capacidad_kg"
                className={`form-control ${errores.capacidad_kg ? "is-invalid" : ""}`}
                value={form.capacidad_kg}
                onChange={handleChange}
              />
              {errores.capacidad_kg && (
                <div className="invalid-feedback">{errores.capacidad_kg}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Nivel de llenado (%)</label>
              <input
                type="number"
                step="0.01"
                name="nivel_llenado"
                className={`form-control ${errores.nivel_llenado ? "is-invalid" : ""}`}
                value={form.nivel_llenado}
                onChange={handleChange}
              />
              {errores.nivel_llenado && (
                <div className="invalid-feedback">{errores.nivel_llenado}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="disponible">Disponible</option>
                <option value="lleno">Lleno</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Último vaciado</label>
              <input
                type="datetime-local"
                name="ultimo_vaciado"
                className="form-control"
                value={form.ultimo_vaciado}
                onChange={handleChange}
              />
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
                  Activo
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : contenedorEditando ? "Actualizar" : "Guardar"}
            </button>

            {contenedorEditando && (
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

export default ContenedorForm;