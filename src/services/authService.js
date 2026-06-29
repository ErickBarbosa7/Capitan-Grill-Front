import { api } from './api'

export function loginUser(email, password) {
  return api.post('/auth/login', { email, password })
}

export function updateProfile(email, name) {
  return api.put('/auth/perfil', { email, name })
}
