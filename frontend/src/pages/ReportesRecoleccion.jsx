import { useEffect, useState } from "react";
import {
  getRecoleccionPorDia,
  getRecoleccionPorRuta,
  getRecoleccionPorZona
} from "../api/reportes-recoleccion.service";

function ReportesRecoleccion() {
  const [porDia, setPorDia] = useState([]);
  const [porRuta, setPorRuta] = useState([]);
  const [porZona, setPorZona] = useState([]);

  const cargarDatos = async () => {
    try {
      const dia = await getRecoleccionPorDia();
      const ruta = await getRecoleccionPorRuta();
      const zona = await getRecoleccionPorZona();

      setPorDia(dia);
      setPorRuta(ruta);
      setPorZona(zona);
    } catch (error) {
      console.error(error);
      const mensaje =
        error?.response?.data?.message ||
        "Error cargando reportes de recolección";
      alert(mensaje);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Reportes de Recolección</h2>

      <div className="card mb-4">
        <div className="card-header">
          Recolección por día
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total recolectado (ton)</th>
            </tr>
          </thead>

          <tbody>
            {porDia.map((item, index) => (
              <tr key={index}>
                <td>{item.fecha}</td>
                <td>{Number(item.total_ton).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          Recolección por ruta
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Ruta</th>
              <th>Total recolectado (ton)</th>
            </tr>
          </thead>

          <tbody>
            {porRuta.map((item, index) => (
              <tr key={index}>
                <td>{item.ruta}</td>
                <td>{Number(item.total_ton).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-header">
          Recolección por zona
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Zona</th>
              <th>Total recolectado (ton)</th>
            </tr>
          </thead>

          <tbody>
            {porZona.map((item, index) => (
              <tr key={index}>
                <td>{item.zona}</td>
                <td>{Number(item.total_ton).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportesRecoleccion;