import { api } from './api'

export function getCategories(includeInactive = false) {
  const params = includeInactive ? '?includeInactive=true' : ''
  return api.get(`/categories${params}`)
}

export function getMenuItems(includeInactive = false) {
  const params = includeInactive ? '?includeInactive=true' : ''
  return api.get(`/menu${params}`)
}

export function createMenuItem(data) {
  return api.post('/menu', data)
}

export function updateMenuItem(id, data) {
  return api.put(`/menu/${id}`, data)
}

export function deleteMenuItem(id) {
  return api.delete(`/menu/${id}`)
}

export function hardDeleteMenuItem(id) {
  return api.delete(`/menu/${id}/hard`)
}

export function toggleMenuItem(id, isAvailable) {
  return api.patch(`/menu/${id}/toggle`, { isAvailable })
}

export function restoreMenuItem(id) {
  return api.patch(`/menu/${id}/restore`)
}

export function createCategory(data) {
  return api.post('/categories', data)
}

export function updateCategory(id, data) {
  return api.put(`/categories/${id}`, data)
}

export function deleteCategory(id) {
  return api.delete(`/categories/${id}`)
}

export function hardDeleteCategory(id) {
  return api.delete(`/categories/${id}/hard`)
}

export function restoreCategory(id) {
  return api.patch(`/categories/${id}/restore`)
}

export function getActivity() {
  return api.get('/activity')
}

export function generateDescription(data) {
  return api.post('/ai/describe', data)
}

export function getMenuViews() {
  return api.get('/stats/menu-views')
}

export function incrementMenuView() {
  return api.post('/stats/menu-view')
}
