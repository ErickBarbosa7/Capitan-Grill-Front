import { api } from './api'

export function loginUser(email, password) {
  return api.post('/auth/login', { email, password })
}
