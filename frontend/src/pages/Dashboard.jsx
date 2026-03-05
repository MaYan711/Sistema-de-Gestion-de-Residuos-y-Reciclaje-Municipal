import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios.js'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function formatLabel(key) {
  const s = String(key ?? '')
  
  const pretty = s
    .replaceAll('_', ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return pretty || '—'
}

function toChartData(obj, label = 'Total') {
  const entries = Object.entries(obj || {})
  return {
    labels: entries.map(([k]) => formatLabel(k)),
    datasets: [
      {
        label,
        data: entries.map(([, v]) => Number(v) || 0),

        
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderColor: 'rgba(255, 255, 255, 0.6)',    
        borderWidth: 1,
      },
    ],
  }
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({
    denuncias_total: 0,
    puntos_verdes_total: 0,
    rutas_total: 0,
  })

  const [charts, setCharts] = useState({
    denuncias_por_estado: {},
    contenedores_por_nivel: {},
    camiones_por_estado: {},
  })

  useEffect(() => {
    api
      .get('/dashboard/kpis')
      .then((r) => {
        const cards = r.data?.cards || {}
        const ch = r.data?.charts || {}

        setKpis({
          denuncias_total: cards.denuncias ?? 0,
          puntos_verdes_total: cards.puntos_verdes ?? 0,
          rutas_total: cards.rutas ?? 0,
        })

        setCharts({
          denuncias_por_estado: ch.denuncias_por_estado || {},
          contenedores_por_nivel: ch.contenedores_por_nivel || {},
          camiones_por_estado: ch.camiones_por_estado || {},
        })
      })
      .catch((e) => console.log('KPIs error:', e.response?.data || e.message))
    
  }, [])

  const dataTotales = useMemo(
  () => ({
    labels: ['Denuncias', 'Puntos Verdes', 'Rutas'],
    datasets: [
      {
        label: 'Totales',
        data: [kpis.denuncias_total, kpis.puntos_verdes_total, kpis.rutas_total],
        backgroundColor: 'rgba(16, 185, 129, 0.75)', 
        borderColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
      },
    ],
  }),
  [kpis]
)

  const dataDenunciasEstado = useMemo(
    () => toChartData(charts.denuncias_por_estado, 'Denuncias'),
    [charts.denuncias_por_estado]
  )

  const dataContenedoresNivel = useMemo(
    () => toChartData(charts.contenedores_por_nivel, 'Contenedores'),
    [charts.contenedores_por_nivel]
  )

  const dataCamionesEstado = useMemo(
    () => toChartData(charts.camiones_por_estado, 'Camiones'),
    [charts.camiones_por_estado]
  )

  
  const opts = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#e5e7eb' }, 
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          ticks: { color: '#e5e7eb' },
          grid: { display: false }, 
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#e5e7eb',
            precision: 0, 
            stepSize: 1,
          },
          grid: {
            color: 'rgba(255,255,255,0.08)', 
          },
        },
      },
    }),
    []
  )

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <div className="grid grid-2">
        <div className="card">
          <h3>KPIs</h3>
          <ul>
            <li>
              Denuncias: <strong>{kpis.denuncias_total}</strong>
            </li>
            <li>
              Puntos verdes: <strong>{kpis.puntos_verdes_total}</strong>
            </li>
            <li>
              Rutas: <strong>{kpis.rutas_total}</strong>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>Gráfica Totales</h3>
          <Bar data={dataTotales} options={opts} />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Denuncias por estado</h3>
          <Bar data={dataDenunciasEstado} options={opts} />
        </div>

        <div className="card">
          <h3>Contenedores por nivel</h3>
          <Bar data={dataContenedoresNivel} options={opts} />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
      <div className="card">
        <h3>Camiones por estado</h3>
        <Bar data={dataCamionesEstado} options={opts} />
      </div>
    </div>
    <div className="card">
  <h3>Alertas</h3>
  <ul>
    <li>Contenedores críticos (≥90%): <strong>{charts.contenedores_por_nivel?.['>=90'] ?? 0}</strong></li>
    <li>Contenedores llenos (=100%): <strong>{charts.contenedores_por_nivel?.['=100'] ?? 0}</strong></li>
    <li>Camiones en mantenimiento: <strong>{charts.camiones_por_estado?.['mantenimiento'] ?? 0}</strong></li>
    <li>
      Denuncias pendientes (Recibida + En revisión):{' '}
      <strong>
        {(charts.denuncias_por_estado?.recibida ?? 0) + (charts.denuncias_por_estado?.en_revision ?? 0)}
      </strong>
    </li>
  </ul>
</div>
        </div>

        
  )
}