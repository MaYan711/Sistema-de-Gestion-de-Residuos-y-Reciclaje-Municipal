import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import RegisterCiudadano from './pages/RegisterCiudadano.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Mapa from './pages/Mapa.jsx'
import Zonas from './pages/Zonas.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Denuncias from './pages/Denuncias.jsx'
import Seguimiento from './pages/Seguimiento.jsx'
import SeguimientoDenuncia from './pages/SeguimientoDenuncia.jsx'
import Rutas from './pages/Rutas.jsx'
import Camiones from './pages/Camiones.jsx'
import AsignacionesRuta from './pages/AsignacionesRuta.jsx'
import Recolecciones from './pages/Recolecciones.jsx'
import PortalRutas from './pages/PortalRutas.jsx'
import MonitoreoAsignaciones from './pages/MonitoreoAsignaciones.jsx'
import TiposMaterial from "./pages/TiposMaterial";
import Contenedores from "./pages/Contenedores";
import AlertasContenedores from "./pages/AlertasContenedores";
import OperacionReciclaje from "./pages/OperacionReciclaje";
import ReportesReciclaje from "./pages/ReportesReciclaje";
import ReportesDenuncias from "./pages/ReportesDenuncias";
import ReportesRecoleccion from "./pages/ReportesRecoleccion";
import Usuarios from "./pages/Usuarios";
import { useAuth } from './auth/AuthContext.jsx'
import { getDefaultRouteByRole } from './utils/roleUtils.js'

function RoleHomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={getDefaultRouteByRole(user)} replace />
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-ciudadano" element={<RegisterCiudadano />} />
        <Route path="/portal-rutas" element={<PortalRutas />} />
        <Route path="/seguimiento-denuncia" element={<SeguimientoDenuncia />} />
        <Route path="/seguimiento" element={<Seguimiento />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleHomeRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mapa"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <Mapa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/zonas"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <Zonas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/camiones"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <Camiones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asignaciones-ruta"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <AsignacionesRuta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoreo-asignaciones"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <MonitoreoAsignaciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recolecciones"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <Recolecciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rutas"
          element={
            <ProtectedRoute roles={["administrador","coordinador"]}>
              <Rutas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/denuncias"
          element={
            <ProtectedRoute roles={["administrador","coordinador","ciudadano"]}>
              <Denuncias />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tipos-material"
          element={
            <ProtectedRoute roles={["administrador","operador"]}>
              <TiposMaterial />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contenedores"
          element={
            <ProtectedRoute roles={["administrador","operador"]}>
              <Contenedores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alertas-contenedores"
          element={
            <ProtectedRoute roles={["administrador","operador"]}>
              <AlertasContenedores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operacion-reciclaje"
          element={
            <ProtectedRoute roles={["administrador","operador"]}>
              <OperacionReciclaje />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes-reciclaje"
          element={
            <ProtectedRoute roles={["administrador","coordinador","auditor"]}>
              <ReportesReciclaje />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes-denuncias"
          element={
            <ProtectedRoute roles={["administrador","coordinador","auditor"]}>
              <ReportesDenuncias />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes-recoleccion"
          element={
            <ProtectedRoute roles={["administrador","coordinador","auditor"]}>
              <ReportesRecoleccion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute roles={["administrador"]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}