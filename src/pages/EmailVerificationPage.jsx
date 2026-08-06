import { useState } from 'react'
import TransitionLink from '../components/TransitionLink'
import GlowBackground from '../components/GlowBackground'
import { useAuth } from '../hooks/useAuth'
import { resendVerificationEmail } from '../lib/api'

function EmailVerificationPage() {
  const { user, logout } = useAuth()
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState(null)

  const handleResend = async () => {
    setSending(true)
    setMessage(null)

    try {
      await resendVerificationEmail()
      setMessage('A fresh verification link is on its way. Check your inbox.')
    } catch (error) {
      if (error?.response?.status === 429) {
        setMessage('Too many requests. Please wait a moment before trying again.')
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <GlowBackground className="absolute inset-0" />
      <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-lime-400">
            LEAN
          </span>
          <TransitionLink
            to="/"
            className="text-sm font-medium text-white/50 transition hover:text-white"
          >
            ← Back to home
          </TransitionLink>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
            Almost there
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Confirm your email
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            We sent a verification link to{' '}
            <span className="font-semibold text-white/80">{user?.email}</span>.
            Click it to activate your account and unlock your dashboard.
          </p>

          {message && (
            <p className="mx-auto mt-6 max-w-xl text-sm text-lime-400">
              {message}
            </p>
          )}

          <div className="mx-auto mt-10 w-full max-w-xl">
            <button
              type="button"
              onClick={handleResend}
              disabled={sending}
              className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-lime-300 disabled:opacity-60"
            >
              {sending ? 'Sending…' : 'Resend verification email'}
            </button>

            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white/80 transition hover:border-white/25 hover:bg-white/10 disabled:opacity-60"
            >
              {logout.isPending ? 'Logging out…' : 'Log out'}
            </button>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-white/40">
            Can't find the email? Check your spam folder or use the button above
            to send a new link.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationPage
