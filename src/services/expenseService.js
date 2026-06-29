import { api } from './api';

export function getExpenseCategories() {
  return api.get('/expense-categories');
}

export function createExpenseCategory(data) {
  return api.post('/expense-categories', data);
}

export function updateExpenseCategory(id, data) {
  return api.put(`/expense-categories/${id}`, data);
}

export function deleteExpenseCategory(id) {
  return api.delete(`/expense-categories/${id}`);
}

export function getExpenses() {
  return api.get('/expenses');
}

export function getExpense(id) {
  return api.get(`/expenses/${id}`);
}

export function createExpense(data) {
  return api.post('/expenses', data);
}

export function updateExpense(id, data) {
  return api.put(`/expenses/${id}`, data);
}

export function deleteExpense(id) {
  return api.delete(`/expenses/${id}`);
}
