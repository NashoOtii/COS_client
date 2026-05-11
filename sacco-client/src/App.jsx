import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ExecutiveDashboard from './pages/executive/ExecutiveDashboard'
import MemberDashboard from './pages/member/MemberDashboard'


// Placeholder pages — we'll build these next
/*const MemberDashboard = () => (
  <div className="min-h-screen bg-gray-950 text-white flex items-center
    justify-center">
    <h1 className="text-2xl">Member Dashboard — coming soon</h1>
  </div>
)*/

/*const ExecutiveDashboard = () => (
  <div className="min-h-screen bg-gray-950 text-white flex items-center
    justify-center">
    <h1 className="text-2xl">Executive Dashboard — coming soon</h1>
  </div>
)*/

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member routes */}
          <Route path="/member" element={
            <ProtectedRoute>
              <MemberDashboard />
            </ProtectedRoute>
          } />

          {/* Executive routes */}
          <Route path="/executive" element={
            <ProtectedRoute executiveOnly>
              <ExecutiveDashboard />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}