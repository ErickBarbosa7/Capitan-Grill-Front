import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import lugarImg from '../../assets/img/Lugar.jpg';
import lugar3Img from '../../assets/img/lugar3.jpg';
import corte1 from '../../assets/img/1.jpeg';
import corte2 from '../../assets/img/2.jpeg';
import corte3 from '../../assets/img/3.jpeg';
import corte4 from '../../assets/img/4.jpeg';
import corte5 from '../../assets/img/6.jpg';

import cortesVideo from '../../assets/videos/cortes.MOV';
import cc from '../../styles/contact-cards.module.css';
import styles from './CustomerLanding.module.css';

const WHATSAPP_URL = 'https://wa.me/524152826863?text=Hola!%20Quisiera%20informes';
const FACEBOOK_URL = 'https://www.facebook.com/people/Capitangrill/100064038762789/';
const INSTAGRAM_URL = 'https://www.instagram.com/capitan_grill.sma2026';

const MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.7508261920125!2d-100.7948010023266!3d21.020145436889177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b4fa8be9fef63%3A0x3dbe1b39bd01f9c6!2sCapitan%20Grill!5e0!3m2!1sen!2smx!4v1782318110505!5m2!1sen!2smx';
const MAPS_REDIRECT_URL = 'https://www.google.com/maps/search/?api=1&query=21.020359,-100.793347';
const WAZE_REDIRECT_URL = 'https://www.waze.com/ul?ll=21.020359,-100.793347&navigate=yes';

function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FavoritesGallery({ items }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) { setActive(0); return; }
    const idx = Math.round((scrollLeft / maxScroll) * (items.length - 1));
    setActive(Math.min(idx, items.length - 1));
  };

  const scrollToIndex = (idx) => {
    if (!trackRef.current) return;
    const { scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const targetLeft = (idx / (items.length - 1)) * maxScroll;
    trackRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  return (
    <div className={styles.favGallery}>
      <div ref={trackRef} className={styles.favTrack} onScroll={handleScroll}>
        {items.map((item, idx) => (
          <article key={idx} className={styles.favCard}>
            {/* Como quitamos favCardInfo, la imagen ocupa el 100% de la altura de favCard */}
            <div className={styles.favImageWrapperFull}>
              {item.type === 'video' ? (
                <video src={item.src} className={styles.favMedia} autoPlay muted loop playsInline />
              ) : (
                <img src={item.src} alt={t('aria.goTo', { number: idx + 1 })} className={styles.favMedia} loading="lazy" />
              )}
              {/* Etiqueta opcional flotante */}
              {item.tag && <span className={styles.favTag}>{item.tag}</span>}
            </div>
          </article>
        ))}
      </div>

      {active > 0 && (
        <button className={`${styles.favArrow} ${styles.favArrowLeft}`} onClick={() => scrollToIndex(active - 1)} aria-label={t('aria.previous')}>
          <ChevronLeft size={20} />
        </button>
      )}
      {active < items.length - 1 && (
        <button className={`${styles.favArrow} ${styles.favArrowRight}`} onClick={() => scrollToIndex(active + 1)} aria-label={t('aria.next')}>
          <ChevronRight size={20} />
        </button>
      )}

      <div className={styles.favDots}>
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.favDot} ${idx === active ? styles.favDotActive : ''}`}
            onClick={() => scrollToIndex(idx)}
            aria-label={t('aria.goTo', { number: idx + 1 })}
          />
        ))}
      </div>
    </div>
  );
}

export default function CustomerLanding() {
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

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  const navItems = [
    { path: '/inicio', label: t('nav.home') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/lugar', label: t('nav.place') },
    { path: '/contacto', label: t('nav.contact') },
  ];

  const favoriteItems = [
    { type: 'video', src: cortesVideo, tag: t('landing.favorites.tags.0') },
    { type: 'image', src: corte1, tag: t('landing.favorites.tags.1') },
    { type: 'video', src: cortesVideo, tag: t('landing.favorites.tags.2') },
    { type: 'image', src: corte3, tag: t('landing.favorites.tags.3') },
    { type: 'image', src: corte4, tag: t('landing.favorites.tags.4') },
    { type: 'image', src: corte5, tag: t('landing.favorites.tags.5') },
  ];

  return (
    <div className={styles.page}>

      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.burger} onClick={() => setMenuOpen(o => !o)} aria-label={t('aria.menu')}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <button key={item.path} className={`${styles.navLink} ${item.path === location.pathname ? styles.navLinkActive : ''}`} onClick={() => goTo(item.path)}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <span className={styles.topBarLogo}>Capitán Grill</span>
        <div className={styles.topBarRight}>
          <button className={styles.langToggle} onClick={toggleLang} aria-label={t('aria.langToggle')}>
            <span className={`${styles.lang} ${i18n.language === 'es' ? styles.langActive : ''}`}>ES</span>
            <span className={styles.langSep}>/</span>
            <span className={`${styles.lang} ${i18n.language === 'en' ? styles.langActive : ''}`}>EN</span>
          </button>
          <a href={WHATSAPP_URL} className={styles.topBarWa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <MessageCircle size={18} />
          </a>
        </div>
      </header>

      <div className={`${styles.hamburgerOverlay} ${menuOpen ? styles.overlayVisible : ''}`} onClick={() => setMenuOpen(false)} />

      <nav className={`${styles.hamburgerMenu} ${menuOpen ? styles.hamburgerOpen : ''}`}>
        {navItems.map((item) => (
          <button key={item.path} className={`${styles.hamburgerItem} ${item.path === location.pathname ? styles.hamburgerItemActive : ''}`} onClick={() => goTo(item.path)}>
            {item.label}
          </button>
        ))}
      </nav>

      {/* ─── 1. HERO: CAPITÁN GRILL ─── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Capitán<br />
              <span className={styles.heroTitleAccent}>Grill</span>
            </h1>
            <p className={styles.heroDesc}>
              {t('landing.hero.desc')}
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={() => goTo('/menu')}>
                {t('landing.hero.viewMenu')}
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                <MessageCircle size={18} />
                {t('landing.hero.reserve')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. NUESTRO LUGAR ─── */}
      <section className={styles.placeSection}>
        <div className={styles.placeInner}>
          <div className={styles.placeMeta}>
            <span className={styles.sectionEyebrow}>{t('landing.place.eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{t('landing.place.title')}</h2>
          </div>
          <div className={styles.bentoGrid}>
            <div className={`${styles.gridCell} ${styles.mainCell}`}>
              <div className={styles.mediaWrapper}>
                <img src={lugarImg} alt="Capitán Grill" className={styles.mediaItem} />
              </div>
            </div>
            <div className={`${styles.gridCell} ${styles.textCell}`}>
              <h3 className={styles.textCellTitle}>{t('landing.place.cardTitle')}</h3>
              <p className={styles.textCellDesc}>
                {t('landing.place.cardDesc')}
              </p>
              <button className={styles.btnLink} onClick={() => goTo('/lugar')}>
                {t('landing.place.viewGallery')}
              </button>
            </div>
            <div className={styles.gridCell}>
              <div className={styles.mediaWrapper}>
                <img src={lugar3Img} alt="Capitán Grill ambiente" className={styles.mediaItem} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. LOS FAVORITOS DEL CAPITÁN ─── */}
      <section className={styles.favSection}>
        <div className={styles.favInner}>
          
          <div className={styles.favHeaderRow}>
            <span className={styles.sectionEyebrow}>{t('landing.favorites.eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{t('landing.favorites.title')}</h2>
          </div>
          
          <FavoritesGallery items={favoriteItems} />
        </div>
      </section>

      {/* ─── 4. UBICACIÓN & CONTACTO ─── */}
      <section className={styles.wideSection}>
        <div className={styles.wideInner}>
          <div className={styles.locationLayout}>
            <div className={styles.locationTextCol}>
              <h2 className={styles.locationHeading}>{t('landing.location.title')}</h2>
              <p className={styles.locationDesc}>
                {t('landing.location.desc')}
              </p>
              <div className={styles.locationActions}>
                <a href={MAPS_REDIRECT_URL} target="_blank" rel="noopener noreferrer" className={styles.btnMaps}>
                  Google Maps
                </a>
                <a href={WAZE_REDIRECT_URL} target="_blank" rel="noopener noreferrer" className={styles.btnWaze}>
                  Waze
                </a>
              </div>
              <div className={cc.contactSocial} style={{ justifyContent: 'flex-start', marginTop: '1.5rem' }}>
                <span className={cc.contactSocialLabel}>{t('social.follow')}</span>
                <div className={cc.contactSocialBtns}>
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`${cc.socialIcon} ${cc.socialIconFb}`} title="Facebook"><FbIcon /></a>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`${cc.socialIcon} ${cc.socialIconIg}`} title="Instagram"><IgIcon /></a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`${cc.socialIcon} ${cc.socialIconWa}`} title="WhatsApp"><WaIcon /></a>
                </div>
              </div>
            </div>
            <div className={styles.locationMapCol}>
              <iframe
                src={MAPS_EMBED_URL}
                className={styles.mapIframe}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Capitán Grill Mapa"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CÓMO LLEGAR ─── */}
      <section className={styles.locationSectionDark}>
        <div className={styles.wideInner}>
          <div className={`${styles.locationLayout} ${styles.locationLayoutReverse}`}>
            <div className={styles.videoCol}>
              <div className={styles.videoPlaceholder}>
                <MessageCircle size={40} />
                <span>{t('landing.directions.videoPlaceholder')}</span>
              </div>
            </div>
            <div className={styles.locationTextCol}>
              <h2 className={styles.locationHeading}>{t('landing.directions.title')}</h2>
              <p className={styles.locationDesc}>
                {t('landing.directions.desc')}
              </p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary} style={{ background: 'var(--gold)', color: 'var(--text-primary)' }}>
                <MessageCircle size={18} />
                {t('landing.directions.reserve')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>

          <div className={styles.footerBrandCol}>
            <span className={styles.footerBrand}>Capitán Grill</span>
            <p className={styles.footerTagline}>
              {t('landing.footer.tagline')}
            </p>
            <div className={styles.footerSocial}>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.footerSocialIcon}><FbIcon /></a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.footerSocialIcon}><IgIcon /></a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.footerSocialIcon}><WaIcon /></a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>{t('landing.footer.explore')}</span>
            <button className={styles.footerLink} onClick={() => goTo('/menu')}>{t('nav.menu')}</button>
            <button className={styles.footerLink} onClick={() => goTo('/lugar')}>{t('nav.place')}</button>
            <button className={styles.footerLink} onClick={() => goTo('/contacto')}>{t('nav.contact')}</button>
          </div>

          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>{t('landing.footer.visitUs')}</span>
            <a href={MAPS_REDIRECT_URL} target="_blank" rel="noopener noreferrer" className={styles.footerInfoRow}>
              <MapPin size={15} />
              {t('landing.footer.address')}
            </a>
            <span className={styles.footerInfoRow}>
              <Clock size={15} />
              {t('location.hours')}
            </span>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.footerInfoRow}>
              <MessageCircle size={15} />
              {t('landing.footer.reserveWhatsApp')}
            </a>
          </div>

        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} Capitán Grill. {t('footer.rights')}</p>
        </div>
      </footer>

    </div>
  );
}