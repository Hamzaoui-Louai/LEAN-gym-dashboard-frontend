import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import GlowBackground from './GlowBackground'
import { useAuth } from '../hooks/useAuth'
import { usePageTransition } from '../hooks/usePageTransition'
import { DASHBOARD_PAGES } from '../lib/dashboardPages'

const iconClass = 'h-[18px] w-[18px] shrink-0'
const SCROLL_MS = 700

const PAGE_INDEX = Object.fromEntries(
  DASHBOARD_PAGES.map((page, index) => [page.path, index]),
)

const ICONS = {
  '/dashboard': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  '/dashboard/members': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  '/dashboard/staff': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  '/dashboard/equipment': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M7 6v12" />
      <path d="M17 6v12" />
      <path d="M5 9v6" />
      <path d="M19 9v6" />
      <path d="M7 12h10" />
    </svg>
  ),
  '/dashboard/check-ins': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  ),
  '/dashboard/subscriptions': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  '/dashboard/finances': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  '/dashboard/gym-profile': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  ),
  '/dashboard/settings': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function animateScroll(from, to, duration, onDone) {
  const startTime = performance.now()
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1)
    window.scrollTo(0, from + (to - from) * easeInOutCubic(progress))
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      onDone?.()
    }
  }
  requestAnimationFrame(step)
}

function StagedPage({ component: Component, innerRef }) {
  return (
    <div
      ref={innerRef}
      aria-hidden="true"
      className="pointer-events-none relative px-6 py-8 sm:px-8 lg:px-10"
    >
      <Component />
    </div>
  )
}

function SidebarContent({ onNavClick }) {
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">
            {user?.name ?? 'Member'}
          </p>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
        </div>
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

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [transition, setTransition] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const contentRef = useRef(null)
  const stagedRef = useRef(null)
  const initialScrollRef = useRef(0)
  const transitioningRef = useRef(false)

  useEffect(() => {
    if (!transition) return
    const prevent = (event) => event.preventDefault()
    window.addEventListener('wheel', prevent, { passive: false })
    window.addEventListener('touchmove', prevent, { passive: false })
    return () => {
      window.removeEventListener('wheel', prevent)
      window.removeEventListener('touchmove', prevent)
    }
  }, [transition])

  useLayoutEffect(() => {
    if (!transition) return
    const contentEl = contentRef.current
    const stagedEl = stagedRef.current
    if (!contentEl || !stagedEl) return

    const contentHeight = contentEl.offsetHeight
    const stagedHeight = stagedEl.offsetHeight

    const finish = () => {
      try {
        flushSync(() => navigate(transition.target))
        window.scrollTo(0, 0)
      } finally {
        setTransition(null)
        transitioningRef.current = false
      }
    }

    if (transition.direction === 'down') {
      const contentBottom =
        contentEl.getBoundingClientRect().top + window.scrollY + contentHeight
      animateScroll(initialScrollRef.current, contentBottom, SCROLL_MS, finish)
    } else {
      const correctedStart = initialScrollRef.current + stagedHeight
      window.scrollTo(0, correctedStart)
      animateScroll(correctedStart, 0, SCROLL_MS, finish)
    }
  }, [transition, navigate])

  const handleNavClick = (event, targetPath) => {
    const targetIndex = PAGE_INDEX[targetPath]
    const currentIndex = PAGE_INDEX[location.pathname]
    if (targetIndex === undefined || currentIndex === undefined) return
    if (transitioningRef.current) {
      event.preventDefault()
      return
    }
    if (targetIndex === currentIndex) {
      event.preventDefault()
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    event.preventDefault()
    initialScrollRef.current = window.scrollY
    transitioningRef.current = true
    setTransition({
      direction: targetIndex > currentIndex ? 'down' : 'up',
      target: targetPath,
      component: DASHBOARD_PAGES[targetIndex].component,
    })
  }

  const handleNav = (event, path) => {
    setSidebarOpen(false)
    handleNavClick(event, path)
  }

  return (
    <div className="min-h-screen bg-black">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-black/80 backdrop-blur lg:block">
        <SidebarContent onNavClick={handleNav} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-black">
            <SidebarContent onNavClick={handleNav} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur lg:hidden">
          <span className="text-lg font-black tracking-tight text-lime-400">
            LEAN
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </header>

        <main className="relative min-h-screen">
          <GlowBackground className="absolute inset-0" />
          {transition?.direction === 'up' && (
            <StagedPage component={transition.component} innerRef={stagedRef} />
          )}
          <div ref={contentRef} className="relative px-6 py-8 sm:px-8 lg:px-10">
            <Outlet />
          </div>
          {transition?.direction === 'down' && (
            <StagedPage component={transition.component} innerRef={stagedRef} />
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
