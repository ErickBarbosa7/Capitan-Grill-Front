import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './admin/layouts/AdminLayout'
import ProtectedRoute from './admin/components/ProtectedRoute'

import CustomerLanding from './customer/pages/CustomerLanding'
import MenuPage from './customer/pages/MenuPage'
import LugarPage from './customer/pages/LugarPage'
import ContactoPage from './customer/pages/ContactoPage'
import BlogPage from './customer/pages/BlogPage'

import LoginPage from './admin/pages/LoginPage'
import Dashboard from './admin/pages/Dashboard'
import MenuTable from './admin/pages/MenuTable'
import EditItemPage from './admin/pages/EditItemPage'
import CategoryManager from './admin/pages/CategoryManager'
import ActivityPage from './admin/pages/ActivityPage'
import ExpensesPage from './admin/pages/ExpensesPage'
import ProfilePage from './admin/pages/ProfilePage'
import UsersPage from './admin/pages/UsersPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/inicio" element={<CustomerLanding />} />
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="menu" element={<MenuPage />} />
      <Route path="lugar" element={<LugarPage />} />
      <Route path="contacto" element={<ContactoPage />} />
      <Route path="blog" element={<BlogPage />} />

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
        <Route path="gastos" element={<ExpensesPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="usuarios" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}
