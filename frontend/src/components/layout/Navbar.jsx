import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { api } from '../../api/axios.js'
import { hasRole } from '../../utils/roleUtils.js'

export default function Navbar() {
  const { isAuthed, logout, user } = useAuth()
  const nav = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (e) {
      console.log('Logout error:', e?.response?.data || e.message)
    } finally {
      logout()
      nav('/login')
    }
  }

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <div
        className="container"
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <strong>ResiduosMuni</strong>

          <NavLink to="/portal-rutas">Portal Rutas</NavLink>

          {isAuthed && (
            <>
              {hasRole(user, ["administrador", "coordinador"]) && (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/mapa">Mapa</NavLink>
                  <NavLink to="/zonas">Zonas</NavLink>
                  <NavLink to="/rutas">Rutas</NavLink>
                  <NavLink to="/camiones">Camiones</NavLink>
                  <NavLink to="/asignaciones-ruta">Asignaciones</NavLink>
                  <NavLink to="/recolecciones">Recolecciones</NavLink>
                  <NavLink to="/monitoreo-asignaciones">Monitoreo</NavLink>
                </>
              )}

              {hasRole(user, ["administrador", "operador"]) && (
                <>
                  <NavLink to="/tipos-material">Tipos Material</NavLink>
                  <NavLink to="/contenedores">Contenedores</NavLink>
                  <NavLink to="/operacion-reciclaje">Operación Reciclaje</NavLink>
                </>
              )}

              {hasRole(user, ["administrador", "coordinador", "ciudadano"]) && (
                <>
                  <NavLink to="/denuncias">Denuncias</NavLink>
                  <NavLink to="/seguimiento">Seguimiento</NavLink>
                </>
              )}

              {hasRole(user, ["administrador", "coordinador", "auditor"]) && (
                <>
                  <NavLink to="/reportes-reciclaje">Reportes Reciclaje</NavLink>
                  <NavLink to="/reportes-denuncias">Reportes Denuncias</NavLink>
                  <NavLink to="/reportes-recoleccion">Reportes Recolección</NavLink>
                </>
              )}

              {hasRole(user, ["administrador"]) && (
                <NavLink to="/usuarios">Usuarios</NavLink>
              )}
            </>
          )}
        </div>

        <div>
          {isAuthed ? (
            <button className="btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <Link className="btn" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}