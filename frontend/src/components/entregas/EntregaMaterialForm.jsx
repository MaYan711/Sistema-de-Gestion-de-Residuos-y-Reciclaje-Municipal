import { useEffect, useMemo, useState } from "react";

function EntregaMaterialForm({ contenedores, ciudadanos, onSubmit, loading }) {
  const [form, setForm] = useState({
    id_contenedor: "",
    id_ciudadano: "",
    cantidad_kg: "",
  });

  const contenedorSeleccionado = useMemo(() => {
    return contenedores.find(
      (c) => Number(c.id_contenedor) === Number(form.id_contenedor)
    );
  }, [contenedores, form.id_contenedor]);

  useEffect(() => {
    if (!contenedorSeleccionado) return;
  }, [contenedorSeleccionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      id_contenedor: Number(form.id_contenedor),
      id_ciudadano: Number(form.id_ciudadano),
      cantidad_kg: Number(form.cantidad_kg),
    });

    setForm({
      id_contenedor: "",
      id_ciudadano: "",
      cantidad_kg: "",
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Registrar entrega de material</h5>
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
                  {c.codigo} - {c.punto_verde_nombre} - {c.tipo_material_nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Ciudadano</label>
            <select
              name="id_ciudadano"
              className="form-select"
              value={form.id_ciudadano}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {ciudadanos.map((c) => (
                <option key={c.id_ciudadano} value={c.id_ciudadano}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Cantidad (kg)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="cantidad_kg"
              className="form-control"
              value={form.cantidad_kg}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-8">
            {contenedorSeleccionado && (
              <div className="border rounded p-3 bg-light h-100">
                <div><strong>Código:</strong> {contenedorSeleccionado.codigo}</div>
                <div><strong>Punto verde:</strong> {contenedorSeleccionado.punto_verde_nombre}</div>
                <div><strong>Material:</strong> {contenedorSeleccionado.tipo_material_nombre}</div>
                <div><strong>Nivel actual:</strong> {Number(contenedorSeleccionado.nivel_llenado).toFixed(2)}%</div>
                <div><strong>Estado:</strong> {contenedorSeleccionado.estado}</div>
              </div>
            )}
          </div>

          <div className="col-12">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Registrar entrega"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntregaMaterialForm;