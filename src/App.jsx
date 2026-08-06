import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PageTransitionProvider } from './components/PageTransition'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  return user ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTransitionProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransitionProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
