import { useEffect, useMemo, useState } from "react";
import MapaRutaSelector from "./MapaRutaSelector";

const initialForm = {
  id_zona: "",
  nombre: "",
  dias_recole: "",
  horario: "",
  tipo_residuo: "mixto",
  activo: true,
};

function calcularDistanciaKm(puntos) {
  if (!puntos || puntos.length < 2) return 0;

  const toRad = (value) => (value * Math.PI) / 180;
  const radioTierraKm = 6371;

  let total = 0;

  for (let i = 0; i < puntos.length - 1; i++) {
    const p1 = puntos[i];
    const p2 = puntos[i + 1];

    const dLat = toRad(p2.lat - p1.lat);
    const dLng = toRad(p2.lng - p1.lng);

    const lat1 = toRad(p1.lat);
    const lat2 = toRad(p2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += radioTierraKm * c;
  }

  return Number(total.toFixed(2));
}

function RutaForm({ zonas, rutaEditando, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initialForm);
  const [modoMapa, setModoMapa] = useState("inicio");
  const [inicio, setInicio] = useState(null);
  const [intermedios, setIntermedios] = useState([]);
  const [fin, setFin] = useState(null);

  useEffect(() => {
    if (rutaEditando) {
      setForm({
        id_zona: rutaEditando.id_zona ?? "",
        nombre: rutaEditando.nombre ?? "",
        dias_recole: rutaEditando.dias_recole ?? "",
        horario: rutaEditando.horario ?? "",
        tipo_residuo: rutaEditando.tipo_residuo ?? "mixto",
        activo: rutaEditando.activo ?? true,
      });

      setInicio(rutaEditando.coor_ini ?? null);
      setIntermedios(rutaEditando.puntos_inter ?? []);
      setFin(rutaEditando.coor_fin ?? null);
      setModoMapa("inicio");
    } else {
      setForm(initialForm);
      setInicio(null);
      setIntermedios([]);
      setFin(null);
      setModoMapa("inicio");
    }
  }, [rutaEditando]);

  const distanciaCalculada = useMemo(() => {
    const puntos = [];
    if (inicio) puntos.push(inicio);
    if (intermedios.length) puntos.push(...intermedios);
    if (fin) puntos.push(fin);
    return calcularDistanciaKm(puntos);
  }, [inicio, intermedios, fin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMapClick = (punto) => {
    if (modoMapa === "inicio") {
      setInicio(punto);
      if (!fin && intermedios.length === 0) {
        setModoMapa("intermedio");
      }
      return;
    }

    if (modoMapa === "intermedio") {
      if (!inicio) {
        alert("Primero debes marcar el punto de inicio");
        return;
      }

      setIntermedios((prev) => [...prev, punto]);
      return;
    }

    if (modoMapa === "fin") {
      if (!inicio) {
        alert("Primero debes marcar el punto de inicio");
        return;
      }

      setFin(punto);
    }
  };

  const limpiarRuta = () => {
    setInicio(null);
    setIntermedios([]);
    setFin(null);
    setModoMapa("inicio");
  };

  const quitarUltimoIntermedio = () => {
    setIntermedios((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id_zona) {
      alert("Debes seleccionar una zona");
      return;
    }

    if (!form.nombre.trim()) {
      alert("Debes ingresar el nombre de la ruta");
      return;
    }

    if (!inicio) {
      alert("Debes marcar el punto de inicio en el mapa");
      return;
    }

    if (!fin) {
      alert("Debes marcar el punto final en el mapa");
      return;
    }

    if (!form.dias_recole.trim()) {
      alert("Debes ingresar los días de recolección");
      return;
    }

    if (!form.horario.trim()) {
      alert("Debes ingresar el horario");
      return;
    }

    const payload = {
      id_zona: Number(form.id_zona),
      nombre: form.nombre.trim(),
      coor_ini: inicio,
      coor_fin: fin,
      puntos_inter: intermedios,
      distancia: distanciaCalculada,
      dias_recole: form.dias_recole.trim(),
      horario: form.horario.trim(),
      tipo_residuo: form.tipo_residuo,
      activo: form.activo,
    };

    console.log(payload);

    await onSubmit(payload);
  };

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">{rutaEditando ? "Editar ruta" : "Registrar ruta"}</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Zona</label>
                <select
                  name="id_zona"
                  className="form-select"
                  value={form.id_zona}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una zona</option>
                  {zonas.map((zona) => (
                    <option key={zona.id_zona} value={zona.id_zona}>
                      {zona.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Nombre de la ruta</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Días de recolección</label>
                <input
                  type="text"
                  name="dias_recole"
                  className="form-control"
                  value={form.dias_recole}
                  onChange={handleChange}
                  placeholder="Lunes-Miércoles-Viernes"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Horario</label>
                <input
                  type="text"
                  name="horario"
                  className="form-control"
                  value={form.horario}
                  onChange={handleChange}
                  placeholder="6:00 AM - 12:00 PM"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Tipo de residuo</label>
                <select
                  name="tipo_residuo"
                  className="form-select"
                  value={form.tipo_residuo}
                  onChange={handleChange}
                >
                  <option value="organico">Orgánico</option>
                  <option value="inorganico">Inorgánico</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Inicio</label>
                <input
                  type="text"
                  className="form-control"
                  value={inicio ? `${inicio.lat}, ${inicio.lng}` : ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Puntos intermedios</label>
                <input
                  type="text"
                  className="form-control"
                  value={intermedios.length}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Fin</label>
                <input
                  type="text"
                  className="form-control"
                  value={fin ? `${fin.lat}, ${fin.lng}` : ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Distancia calculada</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${distanciaCalculada} km`}
                  readOnly
                />
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check">
                  <input
                    id="activoRuta"
                    type="checkbox"
                    name="activo"
                    className="form-check-input"
                    checked={form.activo}
                    onChange={handleChange}
                  />
                  <label htmlFor="activoRuta" className="form-check-label">
                    Activa
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : rutaEditando ? "Actualizar" : "Guardar"}
              </button>

              {rutaEditando && (
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

      <MapaRutaSelector
        inicio={inicio}
        intermedios={intermedios}
        fin={fin}
        modo={modoMapa}
        onCambiarModo={setModoMapa}
        onMapClick={handleMapClick}
        onLimpiarTodo={limpiarRuta}
        onQuitarUltimoIntermedio={quitarUltimoIntermedio}
      />
    </>
  );
}

export default RutaForm;