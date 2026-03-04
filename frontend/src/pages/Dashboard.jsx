import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const [kpis, setKpis] = useState({denuncias_total:0, puntos_verdes_total:0, rutas_total:0})

  useEffect(() => {
    api.get('/dashboard/kpis')
      .then(r => setKpis(r.data.kpis || kpis))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
  api.get('/me')
    .then(r => console.log('ME:', r.data))
    .catch(e => console.log('ME error:', e.response?.data || e.message))
}, [])

  const data = {
    labels: ['Denuncias', 'Puntos Verdes', 'Rutas'],
    datasets: [{
      label: 'Totales',
      data: [kpis.denuncias_total, kpis.puntos_verdes_total, kpis.rutas_total],
    }]
  }

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="grid grid-2">
        <div className="card">
          <h3>KPIs</h3>
          <ul>
            <li>Denuncias: <strong>{kpis.denuncias_total}</strong></li>
            <li>Puntos verdes: <strong>{kpis.puntos_verdes_total}</strong></li>
            <li>Rutas: <strong>{kpis.rutas_total}</strong></li>
          </ul>
        </div>
        <div className="card">
          <h3>Gráfica</h3>
          <Bar data={data} options={{responsive:true}} />
        </div>
      </div>
    </div>
  )
}
