import { api } from './api'

export function getUsers() {
  return api.get('/users')
}

export function createUser(data) {
  return api.post('/users', data)
}

export function updateUser(id, data) {
  return api.put(`/users/${id}`, data)
}

export function removeUser(id) {
  return api.delete(`/users/${id}`)
}
