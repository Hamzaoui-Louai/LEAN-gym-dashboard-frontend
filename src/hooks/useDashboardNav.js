import { createContext, useContext } from 'react'

export const DashboardNavContext = createContext(null)

export function useDashboardNav() {
  const value = useContext(DashboardNavContext)
  if (!value) {
    throw new Error('useDashboardNav must be used within DashboardNavProvider')
  }
  return value
}
