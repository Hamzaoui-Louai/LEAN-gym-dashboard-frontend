import GlowBackground from '../components/GlowBackground'
import { usePageTransition } from '../hooks/usePageTransition'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const { user, logout } = useAuth()
  const { start } = usePageTransition()

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      await logout.mutateAsync()
      start('/')
    } catch {
      start('/')
    }
  }

  return (
    <div className="relative min-h-screen bg-black">
      <GlowBackground className="absolute inset-0" />
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Welcome, {user?.name ?? 'there'}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          You are logged in as {user?.email}. This is a placeholder dashboard —
          gym management features land here next.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="mt-8 w-fit rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/10 disabled:opacity-50"
        >
          {logout.isPending ? 'Signing out…' : 'Log out'}
        </button>
      </div>
    </div>
  )
}

export default DashboardPage
