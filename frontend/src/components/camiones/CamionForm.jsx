import { useEffect, useState } from "react";

const initialForm = {
  id_conductor: "",
  placa: "",
  capacidad: "",
  estado: "operativo",
  marca: "",
  modelo: "",
  anio: "",
};

export default function CamionForm({
  camionEditando,
  conductores,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (camionEditando) {
      setForm({
        id_conductor: camionEditando.id_conductor ?? "",
        placa: camionEditando.placa ?? "",
        capacidad: camionEditando.capacidad ?? "",
        estado: camionEditando.estado ?? "operativo",
        marca: camionEditando.marca ?? "",
        modelo: camionEditando.modelo ?? "",
        anio: camionEditando.anio ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [camionEditando]);

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
      id_conductor: form.id_conductor ? Number(form.id_conductor) : null,
      placa: form.placa.trim(),
      capacidad: Number(form.capacidad),
      estado: form.estado,
      marca: form.marca.trim() || null,
      modelo: form.modelo.trim() || null,
      anio: form.anio ? Number(form.anio) : null,
    };

    await onSubmit(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">{camionEditando ? "Editar camión" : "Registrar camión"}</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Placa</label>
              <input
                type="text"
                name="placa"
                className="form-control"
                value={form.placa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Capacidad (toneladas)</label>
              <input
                type="number"
                step="0.01"
                name="capacidad"
                className="form-control"
                value={form.capacidad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="operativo">Operativo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="fuera_servicio">Fuera de servicio</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Conductor asignado</label>
              <select
                name="id_conductor"
                className="form-select"
                value={form.id_conductor}
                onChange={handleChange}
              >
                <option value="">Sin conductor</option>
                {conductores.map((conductor) => (
                  <option key={conductor.id_usuario} value={conductor.id_usuario}>
                    {conductor.nombre} - {conductor.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Año</label>
              <input
                type="number"
                name="anio"
                className="form-control"
                value={form.anio}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Marca</label>
              <input
                type="text"
                name="marca"
                className="form-control"
                value={form.marca}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Modelo</label>
              <input
                type="text"
                name="modelo"
                className="form-control"
                value={form.modelo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : camionEditando ? "Actualizar" : "Guardar"}
            </button>

            {camionEditando && (
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