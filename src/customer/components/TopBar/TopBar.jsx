import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import tb from './TopBar.module.css';

const WHATSAPP_URL = 'https://wa.me/524152826863?text=Hola!%20Quisiera%20informes';

const navItems = [
  { path: '/inicio', label: 'Inicio' },
  { path: '/menu', label: 'Menú' },
  { path: '/lugar', label: 'Nuestro Lugar' },
  { path: '/contacto', label: 'Contáctanos' },
  { path: '/blog', label: 'Blog' },
];

export default function TopBar() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  return (
    <>
      <header className={tb.topBar}>
        <button className={tb.burger} onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={tb.desktopNav}>
          {navItems.map((item) => (
            <button key={item.path} className={tb.navLink} onClick={() => goTo(item.path)}>
              {item.label}
            </button>
          ))}
        </nav>
        <span className={tb.logo}>Capitán Grill</span>
        <div className={tb.right}>
          <button className={tb.langToggle} onClick={toggleLang} aria-label="Cambiar idioma">
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
          <button key={item.path} className={tb.menuItem} onClick={() => goTo(item.path)}>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
