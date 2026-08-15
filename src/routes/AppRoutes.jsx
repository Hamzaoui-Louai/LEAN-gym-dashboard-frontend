import { Route, Routes } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import LandingPage from '../pages/LandingPage'
import SignupPage from '../pages/SignupPage'
import LoginPage from '../pages/LoginPage'
import EmailVerificationPage from '../pages/EmailVerificationPage'
import NotFoundPage from '../pages/NotFoundPage'
import { DASHBOARD_PAGES } from '../lib/dashboardPages'
import { GuestRoute, VerifiedRoute, VerifyEmailRoute } from './guards'
import EmailVerifiedHandler from './EmailVerifiedHandler'

const DashboardIndexPage = DASHBOARD_PAGES[0].component

function AppRoutes() {
  return (
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
        {DASHBOARD_PAGES.filter((page) => page.path !== '/dashboard').map((page) => (
          <Route
            key={page.path}
            path={page.path.replace('/dashboard/', '')}
            element={<page.component />}
          />
        ))}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
