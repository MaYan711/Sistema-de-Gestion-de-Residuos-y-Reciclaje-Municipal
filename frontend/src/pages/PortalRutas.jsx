import { useEffect, useState } from "react";
import PortalRutaList from "../components/portal-rutas/PortalRutaList";
import PortalRutaMap from "../components/portal-rutas/PortalRutaMap";
import { getPortalRutaById, getPortalRutas, getPortalZonas } from "../api/portal-rutas.service";

export default function PortalRutas() {
  const [zonas, setZonas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    id_zona: "",
    buscar: "",
  });

  const cargarZonas = async () => {
    const data = await getPortalZonas();
    setZonas(data);
  };

  const cargarRutas = async () => {
    setLoading(true);

    try {
      const params = {};

      if (filtros.id_zona) params.id_zona = filtros.id_zona;
      if (filtros.buscar.trim()) params.buscar = filtros.buscar.trim();

      const data = await getPortalRutas(params);
      setRutas(data);

      if (data.length > 0) {
        const rutaCompleta = await getPortalRutaById(data[0].id_ruta);
        setRutaSeleccionada(rutaCompleta);
      } else {
        setRutaSeleccionada(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await cargarZonas();
      await cargarRutas();
    };

    init();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    await cargarRutas();
  };

  const handleSeleccionarRuta = async (ruta) => {
    try {
      const rutaCompleta = await getPortalRutaById(ruta.id_ruta);
      setRutaSeleccionada(rutaCompleta);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Portal público de rutas</h2>
        <p className="text-muted mb-0">
          Consulta ciudadana de rutas, zonas, días y horarios de recolección
        </p>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Filtros</h5>
        </div>

        <div className="card-body">
          <form className="row g-3" onSubmit={handleBuscar}>
            <div className="col-md-5">
              <label className="form-label">Zona</label>
              <select
                name="id_zona"
                className="form-select"
                value={filtros.id_zona}
                onChange={handleFiltroChange}
              >
                <option value="">Todas</option>
                {zonas.map((zona) => (
                  <option key={zona.id_zona} value={zona.id_zona}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-5">
              <label className="form-label">Buscar</label>
              <input
                type="text"
                name="buscar"
                className="form-control"
                value={filtros.buscar}
                onChange={handleFiltroChange}
                placeholder="Nombre de ruta, días, horario o tipo de residuo"
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Cargando..." : "Filtrar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {rutaSeleccionada && (
        <div className="card shadow-sm mb-4">
          <div className="card-header">
            <h5 className="mb-0">Detalle de la ruta seleccionada</h5>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <strong>Ruta:</strong>
                <div>{rutaSeleccionada.nombre}</div>
              </div>

              <div className="col-md-4">
                <strong>Zona:</strong>
                <div>{rutaSeleccionada.zona?.nombre ?? "—"}</div>
              </div>

              <div className="col-md-4">
                <strong>Tipo de residuo:</strong>
                <div className="text-capitalize">{rutaSeleccionada.tipo_residuo}</div>
              </div>

              <div className="col-md-4">
                <strong>Días de recolección:</strong>
                <div>{rutaSeleccionada.dias_recole}</div>
              </div>

              <div className="col-md-4">
                <strong>Horario:</strong>
                <div>{rutaSeleccionada.horario}</div>
              </div>

              <div className="col-md-4">
                <strong>Distancia:</strong>
                <div>{rutaSeleccionada.distancia} km</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <PortalRutaList
            rutas={rutas}
            rutaSeleccionada={rutaSeleccionada}
            onSeleccionar={handleSeleccionarRuta}
          />
        </div>

        <div className="col-lg-8">
          <PortalRutaMap rutaSeleccionada={rutaSeleccionada} />
        </div>
      </div>
    </div>
  );
}