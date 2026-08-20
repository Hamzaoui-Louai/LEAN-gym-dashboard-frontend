import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthErrorScreen from '../components/AuthErrorScreen'

const SESSION_ERROR_MESSAGE =
  "We couldn't reach the server to confirm your session. Check your connection and try again."

const GUEST_ERROR_MESSAGE =
  "We couldn't reach the server to check if you're signed in. Check your connection and try again."

function isGenuineAuthError(error) {
  return error != null && error.response?.status !== 401
}

export function VerifiedRoute({ children }) {
  const { user, isLoading, error } = useAuth()

  if (isGenuineAuthError(error)) {
    return <AuthErrorScreen message={SESSION_ERROR_MESSAGE} />
  }

  if (!isLoading && !user) return <Navigate to="/login" replace />
  if (!isLoading && user && !user.email_verified_at) return <Navigate to="/verify-email" replace />

  return children
}

export function GuestRoute({ children }) {
  const { user, isLoading, error } = useAuth()

  if (isGenuineAuthError(error)) {
    return <AuthErrorScreen message={GUEST_ERROR_MESSAGE} />
  }

  if (!isLoading && user) {
    return user.email_verified_at ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/verify-email" replace />
    )
  }

  return children
}

export function VerifyEmailRoute({ children }) {
  const { user, isLoading, error } = useAuth()

  if (isGenuineAuthError(error)) {
    return <AuthErrorScreen message={SESSION_ERROR_MESSAGE} />
  }

  if (!isLoading && !user) return <Navigate to="/login" replace />
  if (!isLoading && user && user.email_verified_at) return <Navigate to="/dashboard" replace />

  return children
}
