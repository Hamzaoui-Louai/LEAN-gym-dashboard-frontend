import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { setToken } from '../lib/api'

function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const { refreshUser, user, isLoading } = useAuth()
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const token = searchParams.get('token')

    if (!token) {
      setError('No authentication token received.')
      setReady(true)
      return
    }

    setToken(token)

    refreshUser()
      .then(() => {
        if (mounted) setReady(true)
      })
      .catch(() => {
        if (mounted) {
          setError('Failed to verify your account. Please try logging in again.')
          setReady(true)
        }
      })

    const fallback = setTimeout(() => {
      if (mounted) setReady(true)
    }, 8000)

    return () => {
      mounted = false
      clearTimeout(fallback)
    }
  }, [searchParams, refreshUser])

  if (isLoading || !ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6">
        <span className="text-xl font-black tracking-tight text-lime-400">LEAN</span>
        <p className="text-sm text-white/60">Signing you in with Google…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center">
        <span className="text-xl font-black tracking-tight text-lime-400">LEAN</span>
        <p className="text-sm text-red-400">{error}</p>
        <a
          href="/login"
          className="mt-2 rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
        >
          Back to login
        </a>
      </div>
    )
  }

  if (user) return <Navigate to="/dashboard" replace />

  return <Navigate to="/login" replace />
}

export default GoogleCallbackPage
