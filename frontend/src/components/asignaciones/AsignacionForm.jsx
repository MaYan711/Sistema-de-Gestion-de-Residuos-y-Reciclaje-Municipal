import { useEffect, useMemo, useState } from "react";

const initialForm = {
  id_ruta: "",
  id_camion: "",
  fecha_asig: "",
  peso_estimado: "",
};

export default function AsignacionForm({
  rutas,
  camiones,
  asignacionEditando,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (asignacionEditando) {
      setForm({
        id_ruta: asignacionEditando.id_ruta ?? "",
        id_camion: asignacionEditando.id_camion ?? "",
        fecha_asig: asignacionEditando.fecha_asig ?? "",
        peso_estimado: asignacionEditando.peso_estimado ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [asignacionEditando]);

  const camionSeleccionado = useMemo(() => {
    return camiones.find((c) => Number(c.id_camion) === Number(form.id_camion)) || null;
  }, [camiones, form.id_camion]);

  const capacidadKg = camionSeleccionado ? Number(camionSeleccionado.capacidad) * 1000 : 0;
  const pesoIngresado = form.peso_estimado === "" ? 0 : Number(form.peso_estimado);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id_ruta: Number(form.id_ruta),
      id_camion: Number(form.id_camion),
      fecha_asig: form.fecha_asig,
      peso_estimado: form.peso_estimado === "" ? null : Number(form.peso_estimado),
    };

    await onSubmit(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">
          {asignacionEditando ? "Editar asignación" : "Registrar asignación"}
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Ruta</label>
              <select
                name="id_ruta"
                className="form-select"
                value={form.id_ruta}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.id_ruta} value={ruta.id_ruta}>
                    {ruta.nombre} - {ruta.zona?.nombre ?? "Sin zona"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Camión</label>
              <select
                name="id_camion"
                className="form-select"
                value={form.id_camion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un camión</option>
                {camiones.map((camion) => (
                  <option key={camion.id_camion} value={camion.id_camion}>
                    {camion.placa} - {camion.capacidad} ton
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Fecha de asignación</label>
              <input
                type="date"
                name="fecha_asig"
                className="form-control"
                value={form.fecha_asig}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Peso estimado (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso_estimado"
                className="form-control"
                value={form.peso_estimado}
                onChange={handleChange}
                placeholder="Déjalo vacío para cálculo automático"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Capacidad del camión</label>
              <input
                type="text"
                className="form-control"
                value={camionSeleccionado ? `${capacidadKg} kg` : ""}
                readOnly
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Validación rápida</label>
              <input
                type="text"
                className={`form-control ${
                  form.peso_estimado !== ""
                    ? pesoIngresado <= capacidadKg
                      ? "is-valid"
                      : "is-invalid"
                    : ""
                }`}
                value={
                  form.peso_estimado === ""
                    ? "Cálculo automático"
                    : pesoIngresado <= capacidadKg
                    ? "Capacidad suficiente"
                    : "Capacidad insuficiente"
                }
                readOnly
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : asignacionEditando ? "Actualizar" : "Guardar"}
            </button>

            {asignacionEditando && (
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