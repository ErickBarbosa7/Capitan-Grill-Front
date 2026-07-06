import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  BarChart3, ClipboardList, Receipt,
  History, Users, MoreHorizontal,
  LogOut, ExternalLink, User
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import logoImg from '../../assets/logo/logo.png'
import styles from './AdminLayout.module.css'

/* ─── Links principales ─── */
const mainLinks = [
  { to: '/admin',        icon: <BarChart3 size={17} />,    label: 'Inicio' },
  { to: '/admin/menu',   icon: <ClipboardList size={17} />, label: 'Menú',  badge: 'IA' },
  { to: '/admin/gastos', icon: <Receipt size={17} />,       label: 'Gastos' },
]

/* ─── Links secundarios ─── */
const secondaryLinks = [
  { to: '/admin/actividad',  icon: <History size={17} />,    label: 'Movimientos' },
  { to: '/admin/usuarios',   icon: <Users size={17} />,      label: 'Usuarios' },
]

function NavLink({ link, isActive, onClick, className = '' }) {
  return (
    <button
      className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''} ${className}`}
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
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

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

  const closeAll = () => {
    setShowMoreMenu(false)
    setShowProfileMenu(false)
  }

  const handleNav = (to) => {
    closeAll()
    navigate(to)
  }

  return (
    <div className={styles.layout}>

      {/* ─── MOBILE TOP BAR ─── */}
      <div className={styles.mobileTopBar}>
        <span className={styles.mobileTopBarTitle}>Capitán Grill</span>
        <button
          className={styles.mobileAvatarBtn}
          onClick={() => { setShowProfileMenu(p => !p); setShowMoreMenu(false) }}
        >
          {initials}
        </button>

        {showProfileMenu && (
          <>
            <div className={styles.dropdownOverlay} onClick={closeAll} />
            <div className={styles.profileDropdown}>
              <div className={styles.pdHeader}>
                <div className={styles.pdAvatar}>{initials}</div>
                <div className={styles.pdInfo}>
                  <span className={styles.pdName}>{displayName}</span>
                  <span className={styles.pdRole}>{displayRole}</span>
                </div>
              </div>
              <button className={styles.pdItem} onClick={() => handleNav('/admin/perfil')}>
                <User size={15} />
                Ver perfil
              </button>
              <div className={styles.pdDivider} />
              <button className={`${styles.pdItem} ${styles.pdItemDanger}`} onClick={handleLogout}>
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>

      {/* ─── DESKTOP SIDEBAR ─── */}
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

          {/* ─── BOTÓN "MÁS" (SOLO MÓVIL) ─── */}
          <button
            className={`${styles.sidebarLink} ${styles.mobileMoreBtn} ${showMoreMenu ? styles.sidebarLinkActive : ''}`}
            onClick={() => { setShowMoreMenu(p => !p); setShowProfileMenu(false) }}
          >
            <span className={styles.sidebarLinkIcon}><MoreHorizontal size={17} /></span>
            <span className={styles.sidebarLinkLabel}>Más</span>
          </button>
        </nav>

        {/* ─── NAV SECUNDARIA ─── */}
        <div className={styles.navSection}>
          <span className={styles.navSectionLabel}>Configuración</span>
        </div>

        <nav className={styles.sidebarNavSecondary}>
          {secondaryLinks
            .filter(link => link.to !== '/admin/usuarios' || user?.role === 'admin')
            .map(link => (
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
            href="/inicio"
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

      {/* ─── MAIN CONTENT ─── */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* ─── POPOVER "MÁS" ─── */}
      {showMoreMenu && (
        <>
          <div className={styles.dropdownOverlay} onClick={closeAll} />
          <div className={styles.morePopover}>
            {secondaryLinks
              .filter(link => link.to !== '/admin/usuarios' || user?.role === 'admin')
              .map(link => (
              <button
                key={link.to}
                className={`${styles.mpItem} ${isActive(link.to) ? styles.mpItemActive : ''}`}
                onClick={() => handleNav(link.to)}
              >
                <span className={styles.mpIcon}>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  )
}
