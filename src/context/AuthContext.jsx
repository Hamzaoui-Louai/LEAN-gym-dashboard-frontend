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

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] })
  }

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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
