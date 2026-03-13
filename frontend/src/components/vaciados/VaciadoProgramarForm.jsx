import { useState } from "react";

function VaciadoProgramarForm({ contenedores, usuario, onSubmit, loading }) {
  const [form, setForm] = useState({
    id_contenedor: "",
    fecha_prog: "",
    observaciones: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const idUsuario = Number(usuario?.id_usuario ?? usuario?.id);

    if (!idUsuario) {
      alert("No se pudo identificar el usuario actual");
      return;
    }

    onSubmit({
      id_contenedor: Number(form.id_contenedor),
      id_usuario: idUsuario,
      fecha_prog: form.fecha_prog,
      observaciones: form.observaciones.trim() || null,
    });

    setForm({
      id_contenedor: "",
      fecha_prog: "",
      observaciones: "",
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Programar vaciado</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Contenedor</label>
            <select
              name="id_contenedor"
              className="form-select"
              value={form.id_contenedor}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {contenedores.map((c) => (
                <option key={c.id_contenedor} value={c.id_contenedor}>
                  {c.codigo} - {c.punto_verde_nombre} - {c.tipo_material_nombre} - {Number(c.nivel_llenado).toFixed(2)}%
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha programada</label>
            <input
              type="date"
              name="fecha_prog"
              className="form-control"
              value={form.fecha_prog}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Responsable</label>
            <input
              type="text"
              className="form-control"
              value={usuario?.nombre || ""}
              disabled
            />
          </div>

          <div className="col-12">
            <label className="form-label">Observaciones</label>
            <textarea
              name="observaciones"
              className="form-control"
              rows="2"
              value={form.observaciones}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <button className="btn btn-warning" disabled={loading}>
              {loading ? "Guardando..." : "Programar vaciado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VaciadoProgramarForm;