import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { api } from '../../api/axios.js'

export default function Navbar() {
  const { isAuthed, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = async () => {
    try {
      // invalida tokens en el backend (Sanctum)
      await api.post('/logout')
    } catch (e) {
      // si falla, igual cerramos sesión local (token inválido/expirado, backend caído, etc.)
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
              <Link to="/">Dashboard</Link>
              <Link to="/mapa">Mapa</Link>
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