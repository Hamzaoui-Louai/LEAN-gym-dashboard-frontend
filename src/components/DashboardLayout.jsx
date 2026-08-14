import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import DashboardBackground from './DashboardBackground'
import { useAuth } from '../hooks/useAuth'
import { usePageTransition } from '../hooks/usePageTransition'
import { BackgroundProvider } from '../context/BackgroundContext'
import { DataSourceProvider } from '../context/DataSourceContext'
import { DASHBOARD_PAGES } from '../lib/dashboardPages'
import { ICONS, iconClass } from './DashboardIcons'
import { DashboardNavProvider } from '../context/DashboardNavContext'
import DataSourceToggle from './DataSourceToggle'

const SCROLL_MS = 700

const PAGE_INDEX = Object.fromEntries(
  DASHBOARD_PAGES.map((page, index) => [page.path, index]),
)

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function animateEased(duration, onFrame) {
  const startTime = performance.now()
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1)
    onFrame(progress)
    if (progress < 1) {
      requestAnimationFrame(step)
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
  const shellRef = useRef(null)
  const trackRef = useRef(null)
  const initialScrollRef = useRef(0)
  const transitioningRef = useRef(false)
  const animatingRef = useRef(false)
  const navigateRef = useRef(navigate)
  const locationRef = useRef(location.pathname)

  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  useEffect(() => {
    locationRef.current = location.pathname
  }, [location.pathname])

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
    if (animatingRef.current) return
    animatingRef.current = true
    const contentEl = contentRef.current
    const stagedEl = stagedRef.current
    const shellEl = shellRef.current
    const trackEl = trackRef.current
    if (!contentEl || !stagedEl || !shellEl || !trackEl) return

    const contentHeight = contentEl.offsetHeight
    const stagedHeight = stagedEl.offsetHeight
    const contentTop = shellEl.getBoundingClientRect().top + window.scrollY

    shellEl.style.overflow = 'hidden'
    shellEl.style.height = `${contentHeight + stagedHeight}px`
    trackEl.style.willChange = 'transform'

    const startOffset = transition.direction === 'up' ? -stagedHeight : 0
    const endOffset = transition.direction === 'up' ? 0 : -contentHeight

    trackEl.style.transform = `translateY(${startOffset}px)`
    window.scrollTo(0, initialScrollRef.current)

    const finalize = () => {
      const maxScroll = contentTop + stagedHeight - window.innerHeight
      window.scrollTo(0, Math.min(window.scrollY, Math.max(0, maxScroll)))
      contentEl.style.visibility = ''
      flushSync(() => setTransition(null))
      shellEl.style.overflow = ''
      shellEl.style.height = ''
      trackEl.style.transform = ''
      trackEl.style.willChange = ''
      transitioningRef.current = false
      animatingRef.current = false
    }

    const finish = () => {
      contentEl.style.visibility = 'hidden'
      navigateRef.current(transition.target)
      const waitForCommit = (framesLeft) => {
        if (locationRef.current === transition.target || framesLeft <= 0) {
          finalize()
          return
        }
        requestAnimationFrame(() => waitForCommit(framesLeft - 1))
      }
      waitForCommit(120)
    }

    animateEased(SCROLL_MS, (progress) => {
      const eased = easeInOutCubic(progress)
      trackEl.style.transform = `translateY(${
        startOffset + (endOffset - startOffset) * eased
      }px)`
      if (progress === 1) finish()
    })
  }, [transition])

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
    <BackgroundProvider>
      <DataSourceProvider>
        <div className="min-h-screen bg-black">
        <DashboardBackground />
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

      <div className="relative z-10 lg:pl-64">
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
          <DashboardNavProvider navigateTo={handleNavClick}>
            <div ref={shellRef} className="relative">
            <div ref={trackRef}>
              {transition?.direction === 'up' && (
                <StagedPage
                  component={transition.component}
                  innerRef={stagedRef}
                />
              )}
              <div
                ref={contentRef}
                className="relative px-6 py-8 sm:px-8 lg:px-10"
              >
                <div className="mb-6 flex items-center justify-end">
                  <DataSourceToggle />
                </div>
                <Outlet />
              </div>
              {transition?.direction === 'down' && (
                <StagedPage
                  component={transition.component}
                  innerRef={stagedRef}
                />
              )}
            </div>
            </div>
          </DashboardNavProvider>
        </main>
        </div>
      </div>
      </DataSourceProvider>
    </BackgroundProvider>
  )
}

export default DashboardLayout
