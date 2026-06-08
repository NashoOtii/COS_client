import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, executiveOnly = false }) {
  const { user, loading, isExecutive } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (executiveOnly && !isExecutive) return <Navigate to="/member" replace />

  return children
}