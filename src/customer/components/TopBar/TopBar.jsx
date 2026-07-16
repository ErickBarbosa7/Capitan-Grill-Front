import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import tb from './TopBar.module.css';

export default function TopBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    { path: '/inicio', label: t('nav.home') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/lugar', label: t('nav.place') },
    { path: '/contacto', label: t('nav.contact') },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  return (
    <>
      <header className={tb.topBar}>
        <div className={tb.left}>
          <button className={tb.burger} onClick={() => setMenuOpen(o => !o)} aria-label={t('aria.menu')}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <button className={tb.logo} onClick={() => goTo('/inicio')}>Capitán Grill</button>
        <nav className={tb.desktopNav}>
          {navItems.map((item) => (
            <button key={item.path} className={`${tb.navLink} ${item.path === location.pathname ? tb.navLinkActive : ''}`} onClick={() => goTo(item.path)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className={tb.right}>
          <select className={tb.langSelect} value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} aria-label={t('aria.langToggle')}>
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </div>
      </header>

      <div className={`${tb.overlay} ${menuOpen ? tb.overlayVisible : ''}`} onClick={() => setMenuOpen(false)} />

      <nav className={`${tb.menu} ${menuOpen ? tb.menuOpen : ''}`}>
        {navItems.map((item) => (
          <button key={item.path} className={`${tb.menuItem} ${item.path === location.pathname ? tb.menuItemActive : ''}`} onClick={() => goTo(item.path)}>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
