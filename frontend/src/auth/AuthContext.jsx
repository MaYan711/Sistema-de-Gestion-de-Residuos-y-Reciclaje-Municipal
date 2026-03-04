import React, { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const value = useMemo(() => ({
    token,
    isAuthed: !!token,
    login: (newToken) => {
      setToken(newToken)
      localStorage.setItem('token', newToken)
    },
    logout: () => {
      setToken('')
      localStorage.removeItem('token')
    },
  }), [token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
