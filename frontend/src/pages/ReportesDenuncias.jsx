import { useEffect, useState } from "react";
import {
  getDenunciasPorEstado,
  getTiempoPromedioAtencion,
  getZonasConMasDenuncias
} from "../api/reportes-denuncias.service";

function ReportesDenuncias() {

  const [estado, setEstado] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [zonas, setZonas] = useState([]);

  const cargarDatos = async () => {
    try {

      const estadoData = await getDenunciasPorEstado();
      const promedioData = await getTiempoPromedioAtencion();
      const zonasData = await getZonasConMasDenuncias();

      setEstado(estadoData);
      setPromedio(promedioData.tiempo_promedio_dias);
      setZonas(zonasData);

    } catch (error) {
      console.error(error);
      alert("Error cargando reportes de denuncias");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="container py-4">

      <h2 className="mb-4">Reportes de Denuncias</h2>

      <div className="card mb-4">
        <div className="card-header">
          Denuncias por estado
        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {estado.map((item, index) => (
              <tr key={index}>
                <td>{item.estado}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      <div className="card mb-4">

        <div className="card-header">
          Tiempo promedio de atención
        </div>

        <div className="card-body">
          <h4>{promedio} días</h4>
        </div>

      </div>

      <div className="card">

        <div className="card-header">
          Zonas con más denuncias
        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Zona</th>
              <th>Total denuncias</th>
            </tr>
          </thead>

          <tbody>
            {zonas.map((item, index) => (
              <tr key={index}>
                <td>{item.zona}</td>
                <td>{item.total_denuncias}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ReportesDenuncias;