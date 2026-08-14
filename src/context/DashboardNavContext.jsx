import { DashboardNavContext } from '../hooks/useDashboardNav'

export function DashboardNavProvider({ navigateTo, children }) {
  return <DashboardNavContext.Provider value={{ navigateTo }}>{children}</DashboardNavContext.Provider>
}
