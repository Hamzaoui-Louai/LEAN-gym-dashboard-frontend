import { useState } from 'react'
import TransitionLink from '../components/TransitionLink'
import GlowBackground from '../components/GlowBackground'
import loginSidePicture from '../assets/login-side-picture.webp'

const providerButtonClass =
  'flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/80 transition hover:border-white/25 hover:bg-white/10'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid min-h-screen bg-black lg:grid-cols-12">
      <div className="relative hidden lg:col-span-6 lg:block">
        <img
          src={loginSidePicture}
          alt="Inside a modern gym"
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-transparent lg:bg-gradient-to-l lg:from-black lg:via-black/10 lg:to-transparent"
        />
      </div>

      <div className="relative flex flex-col lg:col-span-6 lg:min-h-screen">
        <GlowBackground className="absolute inset-0" />
        <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-12 sm:py-10 lg:px-16">
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

          <div className="flex flex-1 flex-col justify-center py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
              Welcome back
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Log in to LEAN
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              Access your dashboard and keep running your gym in one place.
            </p>

            <form
              className="mt-10 max-w-xl"
              onSubmit={(event) => event.preventDefault()}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/70"
                >
                  Email or phone number
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/70"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-white/40 transition hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-lime-300"
              >
                Log in
              </button>
            </form>

            <p className="mt-6 max-w-xl text-sm text-white/60">
              Don't have an account?{' '}
              <TransitionLink
                to="/signup"
                className="font-semibold text-lime-400 transition hover:text-lime-300"
              >
                Sign up
              </TransitionLink>
            </p>

            <div className="mt-8 flex max-w-xl items-center gap-4">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                or continue with
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <button type="button" className={providerButtonClass}>
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button type="button" className={providerButtonClass}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Apple
              </button>
              <button type="button" className={providerButtonClass}>
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#7FBA00" d="M13 1h10v10H13z" />
                  <path fill="#00A4EF" d="M1 13h10v10H1z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
