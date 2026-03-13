import { useNavigate } from "react-router-dom";

export default function Reportes() {
  const navigate = useNavigate();

  const cards = [
    {
      titulo: "Reportes de Reciclaje",
      descripcion:
        "Consulta materiales reciclados, puntos verdes más activos y tendencias de participación ciudadana.",
      ruta: "/reportes-reciclaje",
      etiqueta: "Módulo 2",
    },
    {
      titulo: "Reportes de Denuncias",
      descripcion:
        "Visualiza denuncias atendidas y pendientes, tiempos promedio de atención y zonas con más incidencias.",
      ruta: "/reportes-denuncias",
      etiqueta: "Módulo 3",
    },
    {
      titulo: "Reportes de Recolección",
      descripcion:
        "Analiza toneladas recolectadas, eficiencia operativa y resultados por rutas, zonas y períodos.",
      ruta: "/reportes-recoleccion",
      etiqueta: "Módulo 1",
    },
  ];

  return (
    <div className="container page-section">
      <div className="hero-panel">
        <div>
          <div className="section-pill">Centro de análisis</div>
          <h1 className="hero-title">Reportes del sistema municipal</h1>
          <p className="hero-text">
            Desde aquí puedes acceder a los reportes principales del sistema y revisar el comportamiento operativo,
            ciudadano y ambiental del proyecto.
          </p>
        </div>
      </div>

      <div className="report-grid">
        {cards.map((card) => (
          <div key={card.titulo} className="report-card">
            <div className="report-card-tag">{card.etiqueta}</div>
            <h3 className="report-card-title">{card.titulo}</h3>
            <p className="report-card-text">{card.descripcion}</p>

            <div className="report-card-actions">
              <button className="btn btn-primary-soft" onClick={() => navigate(card.ruta)}>
                Ver reporte
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}