import { useEffect, useState } from "react";

const initialForm = {
  id_asignacion: "",
  estado: "programada",
  hora_inicio: "",
  hora_fin: "",
  peso_real: "",
  observaciones: "",
  incidencias: [],
};

const nuevaIncidencia = {
  tipo: "",
  descripcion: "",
  fecha_hora: "",
};

export default function RecoleccionForm({
  asignaciones,
  recoleccionEditando,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState(initialForm);
  const [incidencia, setIncidencia] = useState(nuevaIncidencia);

  useEffect(() => {
  if (recoleccionEditando) {
    setForm({
      id_asignacion: recoleccionEditando.id_asignacion ?? "",
      estado: recoleccionEditando.estado ?? "programada",
      hora_inicio: recoleccionEditando.horario_ini
        ? recoleccionEditando.horario_ini.slice(0, 16)
        : "",
      hora_fin: recoleccionEditando.horario_fin
        ? recoleccionEditando.horario_fin.slice(0, 16)
        : "",
      peso_real: recoleccionEditando.basura_ton ?? "",
      observaciones: recoleccionEditando.observaciones ?? "",
      incidencias: Array.isArray(recoleccionEditando.incidencias)
        ? recoleccionEditando.incidencias.map((i) => ({
            tipo: i.tipo ?? "",
            descripcion: i.descripcion ?? "",
            fecha_hora: i.fecha ? i.fecha.slice(0, 16) : "",
          }))
        : [],
    });
  } else {
    setForm(initialForm);
  }

  setIncidencia(nuevaIncidencia);
}, [recoleccionEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncidenciaChange = (e) => {
    const { name, value } = e.target;
    setIncidencia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarIncidencia = () => {
    if (!incidencia.tipo.trim() || !incidencia.descripcion.trim()) return;

    setForm((prev) => ({
      ...prev,
      incidencias: [...prev.incidencias, incidencia],
    }));

    setIncidencia(nuevaIncidencia);
  };

  const quitarIncidencia = (index) => {
    setForm((prev) => ({
      ...prev,
      incidencias: prev.incidencias.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id_asignacion: Number(form.id_asignacion),
      estado: form.estado,
      hora_inicio: form.hora_inicio || null,
      hora_fin: form.hora_fin || null,
      peso_real: form.peso_real === "" ? null : Number(form.peso_real),
      observaciones: form.observaciones.trim() || null,
      incidencias: form.incidencias.map((i) => ({
        tipo: i.tipo,
        descripcion: i.descripcion,
        fecha_hora: i.fecha_hora || null,
      })),
    };

    await onSubmit(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">
          {recoleccionEditando ? "Editar recolección" : "Registrar recolección"}
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Asignación</label>
              <select
                name="id_asignacion"
                className="form-select"
                value={form.id_asignacion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una asignación</option>
                {asignaciones.map((asignacion) => (
                  <option key={asignacion.id_asignacion} value={asignacion.id_asignacion}>
                    #{asignacion.id_asignacion} - {asignacion.ruta?.nombre} - {asignacion.camion?.placa}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="programada">Programada</option>
                <option value="en_proceso">En proceso</option>
                <option value="completada">Completada</option>
                <option value="incompleta">Incompleta</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Hora de inicio</label>
              <input
                type="datetime-local"
                name="hora_inicio"
                className="form-control"
                value={form.hora_inicio}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Hora de finalización</label>
              <input
                type="datetime-local"
                name="hora_fin"
                className="form-control"
                value={form.hora_fin}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Peso real recolectado (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso_real"
                className="form-control"
                value={form.peso_real}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                className="form-control"
                rows="3"
                value={form.observaciones}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <h6 className="mb-3">Incidencias</h6>
            </div>

            <div className="col-md-3">
              <label className="form-label">Tipo</label>
              <input
                type="text"
                name="tipo"
                className="form-control"
                value={incidencia.tipo}
                onChange={handleIncidenciaChange}
                placeholder="Tráfico, avería, lluvia"
              />
            </div>

            <div className="col-md-5">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                name="descripcion"
                className="form-control"
                value={incidencia.descripcion}
                onChange={handleIncidenciaChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Fecha y hora</label>
              <input
                type="datetime-local"
                name="fecha_hora"
                className="form-control"
                value={incidencia.fecha_hora}
                onChange={handleIncidenciaChange}
              />
            </div>

            <div className="col-md-1 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={agregarIncidencia}
              >
                +
              </button>
            </div>

            <div className="col-12">
              {form.incidencias.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Fecha y hora</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.incidencias.map((item, index) => (
                        <tr key={index}>
                          <td>{item.tipo}</td>
                          <td>{item.descripcion}</td>
                          <td>{item.fecha_hora || "Ahora"}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => quitarIncidencia(index)}
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : recoleccionEditando ? "Actualizar" : "Guardar"}
            </button>

            {recoleccionEditando && (
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