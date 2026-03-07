import { useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import L from "leaflet";

const iconoInicio = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconoIntermedio = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:16px;
      height:16px;
      border-radius:50%;
      background:#f59e0b;
      border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.25);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const iconoFin = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:16px;
      height:16px;
      border-radius:50%;
      background:#dc2626;
      border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.25);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function CapturaClicks({ modo, onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick({
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

function MapaRutaSelector({
  inicio,
  intermedios,
  fin,
  onMapClick,
  modo,
  onCambiarModo,
  onLimpiarTodo,
  onQuitarUltimoIntermedio,
}) {
  const center = useMemo(() => {
    if (inicio) return [inicio.lat, inicio.lng];
    return [14.6349, -90.5069];
  }, [inicio]);

  const posicionesLinea = useMemo(() => {
    const puntos = [];
    if (inicio) puntos.push([inicio.lat, inicio.lng]);
    if (intermedios?.length) {
      intermedios.forEach((p) => puntos.push([p.lat, p.lng]));
    }
    if (fin) puntos.push([fin.lat, fin.lng]);
    return puntos;
  }, [inicio, intermedios, fin]);

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 className="mb-0">Trazado de ruta en mapa</h5>

        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className={`btn btn-sm ${modo === "inicio" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => onCambiarModo("inicio")}
          >
            Marcar inicio
          </button>

          <button
            type="button"
            className={`btn btn-sm ${modo === "intermedio" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => onCambiarModo("intermedio")}
          >
            Agregar intermedios
          </button>

          <button
            type="button"
            className={`btn btn-sm ${modo === "fin" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => onCambiarModo("fin")}
          >
            Marcar fin
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onQuitarUltimoIntermedio}
          >
            Quitar último punto
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={onLimpiarTodo}
          >
            Limpiar ruta
          </button>
        </div>
      </div>

      <div className="card-body">
        <p className="text-muted mb-3">
          Modo actual:{" "}
          <strong>
            {modo === "inicio"
              ? "Inicio"
              : modo === "intermedio"
              ? "Puntos intermedios"
              : "Fin"}
          </strong>
        </p>

        <div style={{ height: "450px", width: "100%" }}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CapturaClicks modo={modo} onMapClick={onMapClick} />

            {inicio && (
              <Marker position={[inicio.lat, inicio.lng]} icon={iconoInicio}>
                <Tooltip permanent direction="top">
                  Inicio
                </Tooltip>
              </Marker>
            )}

            {intermedios?.map((punto, index) => (
              <Marker
                key={`${punto.lat}-${punto.lng}-${index}`}
                position={[punto.lat, punto.lng]}
                icon={iconoIntermedio}
              >
                <Tooltip permanent direction="top">
                  P{index + 1}
                </Tooltip>
              </Marker>
            ))}

            {fin && (
              <Marker position={[fin.lat, fin.lng]} icon={iconoFin}>
                <Tooltip permanent direction="top">
                  Fin
                </Tooltip>
              </Marker>
            )}

            {posicionesLinea.length >= 2 && (
              <Polyline positions={posicionesLinea} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default MapaRutaSelector;