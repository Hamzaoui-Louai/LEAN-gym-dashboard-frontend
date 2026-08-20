import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePageTransition } from '../../hooks/usePageTransition'
import { DASHBOARD_PAGES } from '../../lib/dashboardPages'
import { ICONS, iconClass } from '../DashboardIcons'
import { Skeleton } from '../Skeletons'

function Sidebar({ onNavClick }) {
  const { user, logout } = useAuth()
  const { start } = usePageTransition()
  const location = useLocation()

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      await logout.mutateAsync()
    } catch {
      // fall through and navigate home regardless
    }
    start('/')
  }

  const initial = (user?.name ?? '?').charAt(0).toUpperCase()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        {user ? (
          <>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-white/50">{user.email}</p>
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {DASHBOARD_PAGES.map((page) => {
          const active = location.pathname === page.path
          return (
            <Link
              key={page.path}
              to={page.path}
              onClick={(event) => onNavClick?.(event, page.path)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-lime-400 text-black'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {ICONS[page.path]}
              <span className="truncate">{page.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconClass}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          <span>{logout.isPending ? 'Signing out…' : 'Log out'}</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
