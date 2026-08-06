import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthContext } from '../hooks/useAuth'
import {
  login as loginRequest,
  logout as logoutRequest,
  me as meRequest,
  register as registerRequest,
} from '../lib/api'

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: meRequest,
    retry: false,
    staleTime: Infinity,
  })

  const user = data ?? null

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] })
  }, [queryClient])

  const login = useMutation({
    mutationFn: loginRequest,
    onSuccess: refreshUser,
  })

  const register = useMutation({
    mutationFn: registerRequest,
    onSuccess: refreshUser,
  })

  const logout = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
    },
  })

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshUser }),
    [user, isLoading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
