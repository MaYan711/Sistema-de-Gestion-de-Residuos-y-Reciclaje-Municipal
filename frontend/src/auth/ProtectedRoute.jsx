import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth()
  if (loading) return null
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}