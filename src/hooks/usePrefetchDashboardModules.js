import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useDataSource } from './useDataSource'
import { useAuth } from './useAuth'
import { dashboardApi } from '../lib/dashboardApi'

const STALE_TIME = 5 * 60 * 1000

const MODULE_QUERIES = [
  { key: ['members'], fn: dashboardApi.members.list },
  { key: ['staff'], fn: dashboardApi.staff.list },
  { key: ['equipment'], fn: dashboardApi.equipment.list },
  { key: ['equipment-repairs'], fn: dashboardApi.equipment.repairs },
  { key: ['checkins'], fn: dashboardApi.checkins.list },
  { key: ['finances'], fn: dashboardApi.finances.overview },
]

const OWN_KEYS_BY_PATH = {
  '/dashboard': [
    ['dashboard-overview'],
    ['dashboard-insights'],
    ['dashboard-operations'],
    ['dashboard-finances'],
  ],
  '/dashboard/members': [['members']],
  '/dashboard/staff': [['staff']],
  '/dashboard/equipment': [['equipment'], ['equipment-repairs']],
  '/dashboard/check-ins': [['checkins'], ['members']],
  '/dashboard/finances': [['finances'], ['members']],
  '/dashboard/gym-profile': [['gym'], ['members'], ['staff'], ['equipment']],
  '/dashboard/settings': [],
}

function isOwnKey(ownKeys, key) {
  return ownKeys.some((own) => own[0] === key[0])
}

export function usePrefetchDashboardModules() {
  const { pathname } = useLocation()
  const { source } = useDataSource()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (source !== 'api' || !user) return

    const path = pathname.replace(/\/$/, '') || '/dashboard'
    const ownKeys = OWN_KEYS_BY_PATH[path]
    if (!ownKeys) return

    let done = false
    let unsubscribe = () => {}

    const checkReady = () => {
      const ready = ownKeys.every((key) => {
        const state = queryClient.getQueryState(key)
        return state && (state.status === 'success' || state.status === 'error')
      })
      if (!ready || done) return
      done = true
      unsubscribe()
      MODULE_QUERIES.forEach(({ key, fn }) => {
        if (!isOwnKey(ownKeys, key)) {
          queryClient.prefetchQuery({
            queryKey: key,
            queryFn: fn,
            staleTime: STALE_TIME,
            retry: false,
          })
        }
      })
    }

    unsubscribe = queryClient.getQueryCache().subscribe(checkReady)
    checkReady()

    return () => {
      done = true
      unsubscribe()
    }
  }, [pathname, source, user, queryClient])
}

export function PrefetchDashboardModules() {
  usePrefetchDashboardModules()
  return null
}
