import { api } from './api'

function unwrapList(response) {
  const body = response.data
  return Array.isArray(body) ? body : (body?.data ?? [])
}

function unwrapOne(response) {
  const body = response.data
  return Array.isArray(body) ? body[0] ?? null : (body?.data ?? body ?? null)
}

export const dashboardApi = {
  members: {
    list: async () => unwrapList(await api.get('/api/members')),
    create: (payload) => api.post('/api/members', payload),
    update: (payload) => api.put(`/api/members/${payload.id}`, payload),
    remove: (id) => api.delete(`/api/members/${id}`),
  },
  staff: {
    list: async () => unwrapList(await api.get('/api/staff')),
    create: (payload) => api.post('/api/staff', payload),
    update: (payload) => api.put(`/api/staff/${payload.id}`, payload),
    addPayslip: (staffId, payload) =>
      api.post(`/api/staff/${staffId}/payslips`, payload),
  },
  equipment: {
    list: async () => unwrapList(await api.get('/api/equipment')),
    payments: async () =>
      unwrapList(await api.get('/api/equipment/payments')),
    repairs: async () => unwrapList(await api.get('/api/equipment/repairs')),
    create: (payload) => api.post('/api/equipment', payload),
    update: (payload) => api.put(`/api/equipment/${payload.id}`, payload),
  },
  checkins: {
    list: async () => unwrapList(await api.get('/api/checkins')),
    checkIn: (memberId) => api.post('/api/checkins', { member_id: memberId }),
    checkOut: (id) => api.post(`/api/checkins/${id}/check-out`),
  },
  gym: {
    get: async () => unwrapOne(await api.get('/api/gym')),
    update: (payload) => api.put('/api/gym', payload),
  },
  finances: {
    overview: async () => unwrapList(await api.get('/api/finances/overview')),
  },
  user: {
    update: (payload) => api.put('/api/user', payload),
    password: (payload) => api.put('/api/user/password', payload),
    remove: () => api.delete('/api/user'),
  },
}
