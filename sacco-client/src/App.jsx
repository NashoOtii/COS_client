import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './Pages/auth/Login'
import Register from './Pages/auth/Register'
import ExecutiveDashboard from './Pages/executive/ExecutiveDashboard'
import MemberDashboard from './Pages/member/MemberDashboard'
import logoutIcon from './assets/icons8-logout-50.png';

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