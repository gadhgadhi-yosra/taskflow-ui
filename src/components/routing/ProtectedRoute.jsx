import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth() || {};

  if (loading) return null;

  const isAuth = Boolean(user) || localStorage.getItem('isAuthenticated') === 'true'
  return isAuth ? children : <Navigate to="/login" replace />
}
