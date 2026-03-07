import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

const iconoInicio = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
});

const iconoIntermedio = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:12px;
      height:12px;
      border-radius:50%;
      background:#f59e0b;
      border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.25);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const iconoFin = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:12px;
      height:12px;
      border-radius:50%;
      background:#dc2626;
      border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.25);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

export default function RutaMiniMap({ ruta }) {
  const puntos = useMemo(() => {
    const lista = [];
    if (ruta?.coor_ini) lista.push([ruta.coor_ini.lat, ruta.coor_ini.lng]);
    if (Array.isArray(ruta?.puntos_inter)) {
      ruta.puntos_inter.forEach((p) => lista.push([p.lat, p.lng]));
    }
    if (ruta?.coor_fin) lista.push([ruta.coor_fin.lat, ruta.coor_fin.lng]);
    return lista;
  }, [ruta]);

  const center = useMemo(() => {
    if (ruta?.coor_ini) return [ruta.coor_ini.lat, ruta.coor_ini.lng];
    return [14.6349, -90.5069];
  }, [ruta]);

  return (
    <div style={{ width: "100%", height: "180px", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {ruta?.coor_ini && (
          <Marker position={[ruta.coor_ini.lat, ruta.coor_ini.lng]} icon={iconoInicio}>
            <Tooltip permanent direction="top">
              Inicio
            </Tooltip>
          </Marker>
        )}

        {Array.isArray(ruta?.puntos_inter) &&
          ruta.puntos_inter.map((punto, index) => (
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

        {ruta?.coor_fin && (
          <Marker position={[ruta.coor_fin.lat, ruta.coor_fin.lng]} icon={iconoFin}>
            <Tooltip permanent direction="top">
              Fin
            </Tooltip>
          </Marker>
        )}

        {puntos.length >= 2 && <Polyline positions={puntos} />}
      </MapContainer>
    </div>
  );
}