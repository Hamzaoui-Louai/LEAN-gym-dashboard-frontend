import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const REFRESH_FALLBACK_MS = 10000

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
    }, REFRESH_FALLBACK_MS)

    return () => {
      mounted = false
      clearTimeout(fallback)
    }
  }, [refreshUser])

  if (isLoading || !refreshed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6">
        <span className="text-xl font-black tracking-tight text-lime-400">LEAN</span>
        <p className="text-sm text-white/60">Confirming your email…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.email_verified_at) return <Navigate to="/dashboard" replace />

  return <Navigate to="/verify-email" replace />
}

export default EmailVerifiedHandler
