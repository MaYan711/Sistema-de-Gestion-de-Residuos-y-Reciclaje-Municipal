import { useEffect, useState } from "react";
import {
  getReciclajePorTipo,
  getPuntosVerdesActivos,
  getTendenciaReciclaje
} from "../api/reportes-reciclaje.service";

function ReportesReciclaje() {

  const [porTipo, setPorTipo] = useState([]);
  const [puntosVerdes, setPuntosVerdes] = useState([]);
  const [tendencia, setTendencia] = useState([]);

  const cargarDatos = async () => {
    try {

      const tipo = await getReciclajePorTipo();
      const puntos = await getPuntosVerdesActivos();
      const tendenciaData = await getTendenciaReciclaje();

      setPorTipo(tipo);
      setPuntosVerdes(puntos);
      setTendencia(tendenciaData);

    } catch (error) {
      console.error(error);
      alert("Error cargando reportes");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="container py-4">

      <h2 className="mb-4">Reportes de Reciclaje</h2>

      <div className="card mb-4">
        <div className="card-header">
          Cantidad reciclada por tipo de material
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Total reciclado (kg)</th>
            </tr>
          </thead>

          <tbody>
            {porTipo.map((item, index) => (
              <tr key={index}>
                <td>{item.tipo_material}</td>
                <td>{item.total_kg}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <div className="card mb-4">

        <div className="card-header">
          Puntos verdes más activos
        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Punto verde</th>
              <th>Total reciclado (kg)</th>
            </tr>
          </thead>

          <tbody>
            {puntosVerdes.map((item, index) => (
              <tr key={index}>
                <td>{item.punto_verde}</td>
                <td>{item.total_reciclado}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      <div className="card">

        <div className="card-header">
          Tendencia de reciclaje por día
        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total reciclado (kg)</th>
            </tr>
          </thead>

          <tbody>
            {tendencia.map((item, index) => (
              <tr key={index}>
                <td>{item.fecha}</td>
                <td>{item.total_kg}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ReportesReciclaje;