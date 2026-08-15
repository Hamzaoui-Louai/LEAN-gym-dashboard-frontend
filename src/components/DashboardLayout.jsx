import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import DashboardBackground from './DashboardBackground'
import { BackgroundProvider } from '../context/BackgroundContext'
import { DataSourceProvider } from '../context/DataSourceContext'
import { DashboardNavProvider } from '../context/DashboardNavContext'
import { PrefetchDashboardModules } from '../hooks/usePrefetchDashboardModules'
import DataSourceToggle from './DataSourceToggle'
import Sidebar from './dashboard/Sidebar'
import MobileHeader from './dashboard/MobileHeader'
import { useScrollTransition } from './dashboard/useScrollTransition'

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

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { transition, requestTransition, contentRef, stagedRef, shellRef, trackRef } =
    useScrollTransition({ navigate, pathname: location.pathname })

  const handleNav = (event, path) => {
    setSidebarOpen(false)
    requestTransition(event, path)
  }

  return (
    <BackgroundProvider>
      <DataSourceProvider>
        <PrefetchDashboardModules />
        <div className="min-h-screen bg-black">
          <DashboardBackground />
          <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-black/80 backdrop-blur lg:block">
            <Sidebar onNavClick={handleNav} />
          </aside>

          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/70"
                onClick={() => setSidebarOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-black">
                <Sidebar onNavClick={handleNav} />
              </aside>
            </div>
          )}

          <div className="relative z-10 lg:pl-64">
            <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />

            <main className="relative min-h-screen">
              <DashboardNavProvider navigateTo={requestTransition}>
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
