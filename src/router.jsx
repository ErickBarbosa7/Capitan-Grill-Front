import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import MenuTab from './components/MenuTab/MenuTab'
import InfoTab from './components/InfoTab/InfoTab'
import SocialTab from './components/SocialTab/SocialTab'

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MenuTable from './pages/MenuTable'
import EditItemPage from './pages/EditItemPage'
import CategoryManager from './pages/CategoryManager'
import ActivityPage from './pages/ActivityPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<CustomerLayout />}>
        <Route path="menu" element={<MenuTab />} />
        <Route path="info" element={<InfoTab />} />
        <Route path="social" element={<SocialTab />} />
      </Route>

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
        <Route
          path="inventory"
          element={<h1>Inventario — Próximamente</h1>}
        />
        <Route path="categorias" element={<CategoryManager />} />
        <Route path="actividad" element={<ActivityPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
