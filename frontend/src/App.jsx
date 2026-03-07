import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Mapa from './pages/Mapa.jsx'
import Zonas from './pages/Zonas.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Denuncias from './pages/Denuncias.jsx'
import Seguimiento from './pages/Seguimiento.jsx'
import SeguimientoDenuncia from './pages/SeguimientoDenuncia.jsx'
import Rutas from './pages/Rutas.jsx'
import Camiones from './pages/Camiones.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/seguimiento-denuncia" element={<SeguimientoDenuncia />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mapa"
          element={
            <ProtectedRoute>
              <Mapa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/zonas"
          element={
            <ProtectedRoute>
              <Zonas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/camiones"
          element={
            <ProtectedRoute>
              <Camiones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/denuncias"
          element={
            <ProtectedRoute>
              <Denuncias />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rutas"
          element={
            <ProtectedRoute>
              <Rutas />
            </ProtectedRoute>
          }
        />

        <Route path="/seguimiento" element={<Seguimiento />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}