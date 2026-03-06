import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { api } from '../../api/axios.js'
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const { isAuthed, logout } = useAuth()
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <strong>ResiduosMuni</strong>
          {isAuthed && (
            <>
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/mapa">Mapa</NavLink>
              <NavLink to="/denuncias">Denuncias</NavLink>
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