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

const iconoPuntoRecoleccion = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:12px;
      height:12px;
      border-radius:50%;
      background:#16a34a;
      border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.25);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

export default function AsignacionMap({ asignacion }) {
  const center = useMemo(() => {
    if (asignacion?.ruta?.coor_ini) {
      return [asignacion.ruta.coor_ini.lat, asignacion.ruta.coor_ini.lng];
    }

    if (
      asignacion?.ruta?.zona?.latitud_centro !== null &&
      asignacion?.ruta?.zona?.latitud_centro !== undefined &&
      asignacion?.ruta?.zona?.longitud_centro !== null &&
      asignacion?.ruta?.zona?.longitud_centro !== undefined
    ) {
      return [
        Number(asignacion.ruta.zona.latitud_centro),
        Number(asignacion.ruta.zona.longitud_centro),
      ];
    }

    return [14.6349, -90.5069];
  }, [asignacion]);

  const posicionesRuta = useMemo(() => {
    if (!asignacion?.ruta) return [];

    const puntos = [];

    if (asignacion.ruta.coor_ini) {
      puntos.push([asignacion.ruta.coor_ini.lat, asignacion.ruta.coor_ini.lng]);
    }

    if (Array.isArray(asignacion.ruta.puntos_inter)) {
      asignacion.ruta.puntos_inter.forEach((p) => {
        puntos.push([p.lat, p.lng]);
      });
    }

    if (asignacion.ruta.coor_fin) {
      puntos.push([asignacion.ruta.coor_fin.lat, asignacion.ruta.coor_fin.lng]);
    }

    return puntos;
  }, [asignacion]);

  const puntosGenerados = useMemo(() => {
    if (!Array.isArray(asignacion?.puntos_recoleccion)) return [];
    return asignacion.puntos_recoleccion;
  }, [asignacion]);

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Mapa de asignación y puntos generados</h5>
      </div>

      <div className="card-body">
        <div style={{ width: "100%", height: "560px" }}>
          <MapContainer center={center} zoom={13} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {asignacion?.ruta?.coor_ini && (
              <Marker
                position={[asignacion.ruta.coor_ini.lat, asignacion.ruta.coor_ini.lng]}
                icon={iconoInicio}
              >
                <Tooltip permanent direction="top">
                  Inicio
                </Tooltip>
              </Marker>
            )}

            {Array.isArray(asignacion?.ruta?.puntos_inter) &&
              asignacion.ruta.puntos_inter.map((punto, index) => (
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

            {asignacion?.ruta?.coor_fin && (
              <Marker
                position={[asignacion.ruta.coor_fin.lat, asignacion.ruta.coor_fin.lng]}
                icon={iconoFin}
              >
                <Tooltip permanent direction="top">
                  Fin
                </Tooltip>
              </Marker>
            )}

            {posicionesRuta.length >= 2 && <Polyline positions={posicionesRuta} />}

            {puntosGenerados.map((punto) => (
              <Marker
                key={punto.id_punto}
                position={[punto.latitud, punto.longitud]}
                icon={iconoPuntoRecoleccion}
              >
                <Tooltip direction="top">
                  Punto #{punto.orden}
                  <br />
                  Volumen: {punto.volumen_estimado} kg
                  <br />
                  Estado: {punto.recolectado ? "Recolectado" : "Pendiente"}
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}