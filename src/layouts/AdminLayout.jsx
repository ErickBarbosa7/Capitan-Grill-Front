import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, ClipboardList, History, LogOut, ExternalLink, FolderOpen, Sparkles, Receipt, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo/logo.png'
import styles from './AdminLayout.module.css'

const links = [
  { to: '/admin',           icon: <BarChart3 size={17} />,    label: 'Inicio' },
  { to: '/admin/menu',      icon: <ClipboardList size={17} />, label: 'Mi Menú' },
  { to: '/admin/categorias',icon: <FolderOpen size={17} />,   label: 'Categorías' },
  { to: '/admin/actividad', icon: <History size={17} />,       label: 'Movimientos' },
  { to: '/admin/gastos',    icon: <Receipt size={17} />,       label: 'Gastos' },
  { to: '/admin/perfil',    icon: <User size={17} />,         label: 'Perfil' },
]

export default function AdminLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { logout } = useAuth()

  const isActive = (to) =>
    to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(to)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>

        {/* ─── BRAND ─── */}
        <div className={styles.sidebarBrand}>
          <img src={logoImg} alt="Capitán Grill" className={styles.sidebarLogoImg} />
          <div className={styles.sidebarBrandText}>
            <span className={styles.sidebarTitle}>Capitán Grill</span>
            <span className={styles.sidebarSubtitle}>Administración</span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* ─── LABEL SECCIÓN ─── */}
        <div className={styles.navSection}>
          <span className={styles.navSectionLabel}>Gestión</span>
        </div>

        {/* ─── NAVEGACIÓN ─── */}
        <nav className={styles.sidebarNav}>
          {links.map((link) => (
            <button
              key={link.to}
              className={`${styles.sidebarLink} ${isActive(link.to) ? styles.sidebarLinkActive : ''}`}
              onClick={() => navigate(link.to)}
            >
              <span className={styles.sidebarLinkIcon}>{link.icon}</span>
              <span className={styles.sidebarLinkLabel}>{link.label}</span>
              {link.to === '/admin/menu' && (
                <span className={styles.linkBadge}>IA</span>
              )}
            </button>
          ))}
        </nav>

        {/* ─── FOOTER ─── */}
        <div className={styles.sidebarFooter}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewPublicBtn}
          >
            <ExternalLink size={15} />
            <span>Ver menú público</span>
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} />
            <span>Cerrar sesión</span>
          </button>
        </div>

      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}