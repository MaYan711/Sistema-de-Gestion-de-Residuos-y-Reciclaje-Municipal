import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

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
      width:14px;
      height:14px;
      border-radius:50%;
      background:#f59e0b;
      border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.25);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const iconoFin = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:14px;
      height:14px;
      border-radius:50%;
      background:#dc2626;
      border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.25);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function PortalRutaMap({ rutaSeleccionada }) {
  const center = useMemo(() => {
    if (rutaSeleccionada?.coor_ini) {
      return [rutaSeleccionada.coor_ini.lat, rutaSeleccionada.coor_ini.lng];
    }

    if (
      rutaSeleccionada?.zona?.latitud_centro !== null &&
      rutaSeleccionada?.zona?.latitud_centro !== undefined &&
      rutaSeleccionada?.zona?.longitud_centro !== null &&
      rutaSeleccionada?.zona?.longitud_centro !== undefined
    ) {
      return [
        Number(rutaSeleccionada.zona.latitud_centro),
        Number(rutaSeleccionada.zona.longitud_centro),
      ];
    }

    return [14.6349, -90.5069];
  }, [rutaSeleccionada]);

  const posiciones = useMemo(() => {
    if (!rutaSeleccionada) return [];

    const puntos = [];

    if (rutaSeleccionada.coor_ini) {
      puntos.push([rutaSeleccionada.coor_ini.lat, rutaSeleccionada.coor_ini.lng]);
    }

    if (Array.isArray(rutaSeleccionada.puntos_inter)) {
      rutaSeleccionada.puntos_inter.forEach((p) => {
        puntos.push([p.lat, p.lng]);
      });
    }

    if (rutaSeleccionada.coor_fin) {
      puntos.push([rutaSeleccionada.coor_fin.lat, rutaSeleccionada.coor_fin.lng]);
    }

    return puntos;
  }, [rutaSeleccionada]);

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Mapa de ruta</h5>
      </div>

      <div className="card-body">
        <div style={{ width: "100%", height: "520px" }}>
          <MapContainer center={center} zoom={13} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {rutaSeleccionada?.coor_ini && (
              <Marker
                position={[rutaSeleccionada.coor_ini.lat, rutaSeleccionada.coor_ini.lng]}
                icon={iconoInicio}
              >
                <Tooltip permanent direction="top">
                  Inicio
                </Tooltip>
              </Marker>
            )}

            {Array.isArray(rutaSeleccionada?.puntos_inter) &&
              rutaSeleccionada.puntos_inter.map((punto, index) => (
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

            {rutaSeleccionada?.coor_fin && (
              <Marker
                position={[rutaSeleccionada.coor_fin.lat, rutaSeleccionada.coor_fin.lng]}
                icon={iconoFin}
              >
                <Tooltip permanent direction="top">
                  Fin
                </Tooltip>
              </Marker>
            )}

            {posiciones.length >= 2 && <Polyline positions={posiciones} />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}