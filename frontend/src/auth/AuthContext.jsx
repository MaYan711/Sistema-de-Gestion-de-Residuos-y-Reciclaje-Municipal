import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function boot() {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await api.get('/me')
        setUser(data.usuario)
        localStorage.setItem('user', JSON.stringify(data.usuario))
      } catch {
        setToken('')
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }
    boot()
  }, [token])

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthed: !!token,
    login: (newToken, newUser) => {
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    },
    logout: async () => {
      try { await api.post('/logout') } catch {}
      setToken('')
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }