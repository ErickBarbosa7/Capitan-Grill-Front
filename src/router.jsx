import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'

import CustomerLanding from './pages/CustomerLanding'

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MenuTable from './pages/MenuTable'
import EditItemPage from './pages/EditItemPage'
import CategoryManager from './pages/CategoryManager'
import ActivityPage from './pages/ActivityPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLanding />} />

      <Route path="login" element={<LoginPage />} />

      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuTable />} />
        <Route path="menu/nuevo" element={<EditItemPage />} />
        <Route path="menu/editar/:code" element={<EditItemPage />} />
        <Route path="inventory" element={<h1>Inventario — Próximamente</h1>} />
        <Route path="categorias" element={<CategoryManager />} />
        <Route path="actividad" element={<ActivityPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}