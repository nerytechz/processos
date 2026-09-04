import { Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../lib/AuthContext'

export function RequireUsername({ children }) {
  const { user, profile, ready } = useAuth()
  if (!ready) return <Layout>Carregando…</Layout>
  if (!user) return <Navigate to="/login" replace />
  if (!profile) return <Navigate to="/onboarding" replace />
  return children
}
