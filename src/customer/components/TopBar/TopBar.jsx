import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import tb from './TopBar.module.css';

const WHATSAPP_URL = 'https://wa.me/524621740541?text=Hola!%20Quisiera%20informes';

export default function TopBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

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
          <nav className={tb.desktopNav}>
            {navItems.map((item) => (
              <button key={item.path} className={`${tb.navLink} ${item.path === location.pathname ? tb.navLinkActive : ''}`} onClick={() => goTo(item.path)}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <span className={tb.logo}>Capitán Grill</span>
        <div className={tb.right}>
          <button className={tb.langToggle} onClick={toggleLang} aria-label={t('aria.langToggle')}>
            <span className={`${tb.lang} ${i18n.language === 'es' ? tb.langActive : ''}`}>ES</span>
            <span className={tb.langSep}>/</span>
            <span className={`${tb.lang} ${i18n.language === 'en' ? tb.langActive : ''}`}>EN</span>
          </button>
          <a href={WHATSAPP_URL} className={tb.wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <MessageCircle size={18} />
          </a>
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
