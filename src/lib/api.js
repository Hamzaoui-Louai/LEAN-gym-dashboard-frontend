import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

async function withCsrf() {
  await api.get('/sanctum/csrf-cookie')
}

export async function fetchCsrf() {
  return api.get('/sanctum/csrf-cookie')
}

export async function login(credentials) {
  await withCsrf()
  const response = await api.post('/login', credentials)
  return response.data
}

export async function register(payload) {
  await withCsrf()
  const response = await api.post('/register', payload)
  return response.data
}

export async function logout() {
  await withCsrf()
  const response = await api.post('/logout')
  return response.data
}

export async function me() {
  const response = await api.get('/api/user')
  return response.data
}

export async function resendVerificationEmail() {
  await withCsrf()
  const response = await api.post('/email/verification-notification')
  return response.data
}
