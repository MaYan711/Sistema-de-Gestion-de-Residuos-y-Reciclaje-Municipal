import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { useAuth } from '../auth/AuthContext.jsx'

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
      nav('/')
    } catch (err) {
      setError('No se pudo iniciar sesión')
    }
  }

  return (
    <div className="container" style={{maxWidth: 420}}>
      <h2>Login</h2>
      <div className="card">
        <form onSubmit={onSubmit} className="grid">
          <div>
            <label>Email</label>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          {error && <div style={{color:'#ffb4b4'}}>{error}</div>}
          <button className="btn" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}
