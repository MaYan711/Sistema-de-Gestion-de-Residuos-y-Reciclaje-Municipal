import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { getDefaultRouteByRole } from '../utils/roleUtils.js'

export default function Login() {
  const [email, setEmail] = useState('admin@muni.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const { data } = await api.post('/login', { email, password })
      login(data.token, data.usuario)
      nav(getDefaultRouteByRole(data.usuario), { replace: true })
    } catch (err) {
      const mensaje =
        err?.response?.data?.message ||
        'No se pudo iniciar sesión'
      setError(mensaje)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Login</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="alert alert-danger mb-0">{error}</div>}

            <button className="btn btn-primary" type="submit">
              Entrar
            </button>

            <Link className="btn btn-outline-secondary" to="/register-ciudadano">
              Crear cuenta ciudadana
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}