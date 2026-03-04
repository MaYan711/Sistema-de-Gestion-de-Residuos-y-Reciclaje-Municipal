import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function Mapa() {
  // Demo: centro en Guatemala City aprox
  const center = [14.6349, -90.5069]

  return (
    <div className="container">
      <h2>Mapa</h2>
      <div className="card" style={{padding: 0, overflow:'hidden'}}>
        <div style={{height: '70vh', width: '100%'}}>
          <MapContainer center={center} zoom={12} style={{height:'100%', width:'100%'}}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
              <Popup>Centro (demo)</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
