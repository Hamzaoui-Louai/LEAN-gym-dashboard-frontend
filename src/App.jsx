import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PageTransitionProvider } from './components/PageTransition'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import DashboardLayout from './components/DashboardLayout'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import NotFoundPage from './pages/NotFoundPage'
import { DASHBOARD_PAGES } from './lib/dashboardPages'

const DashboardIndexPage = DASHBOARD_PAGES[0].component

function VerifiedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) return <Navigate to="/login" replace />
  if (!user.email_verified_at) return <Navigate to="/verify-email" replace />

  return children
}

function GuestRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (user) {
    return user.email_verified_at ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/verify-email" replace />
    )
  }

  return children
}

function VerifyEmailRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) return <Navigate to="/login" replace />
  if (user.email_verified_at) return <Navigate to="/dashboard" replace />

  return children
}

function EmailVerifiedHandler() {
  const { user, isLoading, refreshUser } = useAuth()
  const [refreshed, setRefreshed] = useState(false)

  useEffect(() => {
    let mounted = true

    refreshUser().then(() => {
      if (mounted) setRefreshed(true)
    })

    const fallback = setTimeout(() => {
      if (mounted) setRefreshed(true)
    }, 10000)

    return () => {
      mounted = false
      clearTimeout(fallback)
    }
  }, [refreshUser])

  if (isLoading || !refreshed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6">
        <span className="text-xl font-black tracking-tight text-lime-400">
          LEAN
        </span>
        <p className="text-sm text-white/60">Confirming your email…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.email_verified_at) return <Navigate to="/dashboard" replace />

  return <Navigate to="/verify-email" replace />
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
              path="/verify-email"
              element={
                <VerifyEmailRoute>
                  <EmailVerificationPage />
                </VerifyEmailRoute>
              }
            />
            <Route path="/email-verified" element={<EmailVerifiedHandler />} />
            <Route
              path="/dashboard"
              element={
                <VerifiedRoute>
                  <DashboardLayout />
                </VerifiedRoute>
              }
            >
              <Route index element={<DashboardIndexPage />} />
              {DASHBOARD_PAGES.filter(
                (page) => page.path !== '/dashboard',
              ).map((page) => (
                <Route
                  key={page.path}
                  path={page.path.replace('/dashboard/', '')}
                  element={<page.component />}
                />
              ))}
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransitionProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
