import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  BarChart3, ClipboardList, Receipt,
  History, Users,
  LogOut, ExternalLink, User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo/logo.png'
import styles from './AdminLayout.module.css'

/* ─── Links principales ─── */
const mainLinks = [
  { to: '/admin',        icon: <BarChart3 size={17} />,    label: 'Inicio' },
  { to: '/admin/menu',   icon: <ClipboardList size={17} />, label: 'Mi Menú',  badge: 'IA' },
  { to: '/admin/gastos', icon: <Receipt size={17} />,       label: 'Gastos' },
]

/* ─── Links secundarios ─── */
const secondaryLinks = [
  { to: '/admin/actividad',  icon: <History size={17} />,    label: 'Movimientos' },
  { to: '/admin/usuarios',   icon: <Users size={17} />,      label: 'Usuarios' },
]

function NavLink({ link, isActive, onClick }) {
  return (
    <button
      className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
      onClick={onClick}
    >
      <span className={styles.sidebarLinkIcon}>{link.icon}</span>
      <span className={styles.sidebarLinkLabel}>{link.label}</span>
      {link.badge && <span className={styles.linkBadge}>{link.badge}</span>}
    </button>
  )
}

export default function AdminLayout() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { user, logout } = useAuth()

  const isActive = (to) =>
    to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(to)

  const handleLogout = () => { logout(); navigate('/login') }

  /* Iniciales para el avatar */
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'A'

  const displayName = user?.name || user?.email?.split('@')[0] || 'Admin'
  const displayRole = user?.role === 'admin' ? 'Administrador' : 'Usuario'

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>

        {/* ─── BRAND ─── */}
        <div className={styles.sidebarBrand}>
          <img src={logoImg} alt="Capitán Grill" className={styles.sidebarLogoImg} />
          <div className={styles.sidebarBrandText}>
            <span className={styles.sidebarTitle}>Capitán Grill</span>
            <span className={styles.sidebarSubtitle}>Panel del dueño</span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* ─── NAV PRINCIPAL ─── */}
        <div className={styles.navSection}>
          <span className={styles.navSectionLabel}>Principal</span>
        </div>

        <nav className={styles.sidebarNav}>
          {mainLinks.map(link => (
            <NavLink
              key={link.to}
              link={link}
              isActive={isActive(link.to)}
              onClick={() => navigate(link.to)}
            />
          ))}
        </nav>

        {/* ─── NAV SECUNDARIA ─── */}
        <div className={styles.navSection}>
          <span className={styles.navSectionLabel}>Configuración</span>
        </div>

        <nav className={styles.sidebarNavSecondary}>
          {secondaryLinks.map(link => (
            <NavLink
              key={link.to}
              link={link}
              isActive={isActive(link.to)}
              onClick={() => navigate(link.to)}
            />
          ))}
        </nav>

        {/* ─── ESPACIADOR ─── */}
        <div className={styles.spacer} />

        {/* ─── PERFIL ─── */}
        <div className={styles.divider} />
        <button
          className={`${styles.profileBlock} ${isActive('/admin/perfil') ? styles.profileBlockActive : ''}`}
          onClick={() => navigate('/admin/perfil')}
        >
          <div className={styles.profileAvatar}>
            {initials}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{displayName}</span>
            <span className={styles.profileRole}>{displayRole}</span>
          </div>
          <User size={14} className={styles.profileChevron} />
        </button>

        {/* ─── FOOTER ─── */}
        <div className={styles.sidebarFooter}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewPublicBtn}
          >
            <ExternalLink size={14} />
            <span>Ver menú público</span>
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={14} />
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