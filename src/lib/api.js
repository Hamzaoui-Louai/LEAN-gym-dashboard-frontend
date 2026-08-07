import axios from 'axios'

const TOKEN_KEY = 'auth_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function login(credentials) {
  const { data } = await api.post('/api/login', credentials)
  setToken(data.access_token)
  return data
}

export async function register(payload) {
  const { data } = await api.post('/api/register', payload)
  setToken(data.access_token)
  return data
}

export async function logout() {
  await api.post('/api/logout')
  clearToken()
}

export async function me() {
  const { data } = await api.get('/api/user')
  return data
}

export async function resendVerificationEmail() {
  const { data } = await api.post('/api/email/verification-notification')
  return data
}
