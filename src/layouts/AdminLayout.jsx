import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, ClipboardList, History, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo/logo.png' // Asegúrate de que la ruta sea correcta
import styles from './AdminLayout.module.css'

const links = [
  { to: '/admin', icon: <BarChart3 size={20} />, label: 'Inicio' },
  { to: '/admin/menu', icon: <ClipboardList size={20} />, label: 'Mi Menú' },
  { to: '/admin/actividad', icon: <History size={20} />, label: 'Movimientos' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        {/* Marca y Logo */}
        <div className={styles.sidebarBrand}>
          <img src={logoImg} alt="Capitán Grill" className={styles.sidebarLogoImg} />
          <div className={styles.sidebarBrandText}>
            <span className={styles.sidebarTitle}>Capitán Grill</span>
            <span className={styles.sidebarSubtitle}>Tablero del Capitán</span>
          </div>
        </div>

        {/* Navegación */}
        <nav className={styles.sidebarNav}>
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <button
                key={link.to}
                className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                onClick={() => navigate(link.to)}
              >
                <span className={styles.sidebarLinkIcon}>{link.icon}</span>
                <span className={styles.sidebarLinkLabel}>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Botón de Salir */}
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Área de Contenido Central */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}