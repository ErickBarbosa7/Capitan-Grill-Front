import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UtensilsCrossed, MapPin, Phone, Clock, ChevronDown, ExternalLink } from 'lucide-react';
import cc from '../styles/contact-cards.module.css';
import MenuTab from '../components/MenuTab/MenuTab';
import InfoTab from '../components/InfoTab/InfoTab';
import SocialTab from '../components/SocialTab/SocialTab';
import BottomNav from '../components/BottomNav/BottomNav';
import styles from './CustomerLanding.module.css';

/* ─ URLs externas ─ */
const FACEBOOK_URL  = 'https://www.facebook.com/people/Capitangrill/100064038762789/';
const WHATSAPP_URL  = 'https://wa.me/524151583036?text=Hola!%20Quisiera%20informes';
const INSTAGRAM_URL = 'https://www.instagram.com/capitan_grill.sma2026';
const MAPS_URL      = 'https://maps.app.goo.gl/HVvjHMRtFRFWStQt7';
const MAPS_EMBED    = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.7508261920125!2d-100.7948010023266!3d21.020145436889177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b4fa8be9fef63%3A0x3dbe1b39bd01f9c6!2sCapitan%20Grill!5e0!3m2!1sen!2smx!4v1782318110505!5m2!1sen!2smx';

/* ─ Iconos inline ─ */
function FbIcon()  { return <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }
function IgIcon()  { return <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>; }
function WaIcon()  { return <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>; }

const tabs = ['menu', 'info', 'social'];

export default function CustomerLanding() {
  const { t } = useTranslation();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mobileTab, setMobileTab] = useState('menu');
  const heroRef = useRef(null);

  /* Navbar scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  return (
    <div className={styles.page}>

      {/* ══════════════════════════════════════
          MOBILE CONTENT (visible solo < 1024px)
      ══════════════════════════════════════ */}
      <div className={styles.mobileContent}>
        {mobileTab === 'menu' && <MenuTab />}
        {mobileTab === 'info' && <InfoTab />}
        {mobileTab === 'social' && <SocialTab />}
        <BottomNav activeTab={mobileTab} onTabChange={setMobileTab} />
      </div>

      {/* ══════════════════════════════════════
          DESKTOP CONTENT (visible solo >= 1024px)
      ══════════════════════════════════════ */}
      <div className={styles.desktopContent}>

        {/* ── NAVBAR ── */}
        <nav className={`${styles.navbar} ${scrolled ? styles.navbarSolid : ''}`}>
          <div className={styles.navInner}>
            <button className={styles.navLogo} onClick={() => scrollTo('hero')}>
              Capitán Grill
            </button>

            <div className={styles.navLinks}>
              <button className={styles.navLink} onClick={() => scrollTo('menu')}>Menú</button>
              <button className={styles.navLink} onClick={() => scrollTo('concepto')}>Concepto</button>
              <button className={styles.navLink} onClick={() => scrollTo('ubicacion')}>Ubicación</button>
            </div>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.navCta}>
              Reservar
            </a>

            <button
              className={styles.burger}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Abrir menú"
            >
              <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen1 : ''}`} />
              <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen2 : ''}`} />
              <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen3 : ''}`} />
            </button>
          </div>

          <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
            <button className={styles.mobileLink} onClick={() => scrollTo('menu')}>Menú</button>
            <button className={styles.mobileLink} onClick={() => scrollTo('concepto')}>Concepto</button>
            <button className={styles.mobileLink} onClick={() => scrollTo('ubicacion')}>Ubicación</button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.mobileCta}>
              Reservar por WhatsApp
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" ref={heroRef} className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <span className={styles.heroEyebrow}>Meat Boutique · San Miguel de Allende</span>
              <h1 className={styles.heroTitle}>
                Capitán<br />
                <span className={styles.heroTitleGold}>Grill</span>
              </h1>
              <p className={styles.heroDesc}>
                Cortes finos a la parrilla en un entorno rústico.<br />
                El sabor del norte, directo al fuego.
              </p>
              <div className={styles.heroActions}>
                <button className={styles.btnPrimary} onClick={() => scrollTo('menu')}>
                  <UtensilsCrossed size={17} />
                  Ver Menú Digital
                </button>
                <button className={styles.btnGhost} onClick={() => scrollTo('concepto')}>
                  Nuestra Historia
                </button>
              </div>
            </div>
          </div>

          <button className={styles.scrollHint} onClick={() => scrollTo('menu')}>
            <ChevronDown size={20} />
          </button>
        </section>

        {/* ── MENÚ DIGITAL ── */}
        <section id="menu" className={styles.menuSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Nuestra Carta</span>
            <h2 className={styles.sectionTitle}>Menú Digital</h2>
            <p className={styles.sectionDesc}>
              Todos nuestros cortes, entradas y bebidas, siempre actualizados.
            </p>
          </div>
          <div className={styles.menuCard}>
            <MenuTab />
          </div>
        </section>

        {/* ── CONCEPTO / NOSOTROS ── */}
        <section id="concepto" className={styles.conceptSection}>
          <div className={styles.conceptInner}>
            <div className={styles.conceptText}>
              <span className={styles.sectionEyebrowLight}>Nuestra Historia</span>
              <h2 className={styles.conceptTitle}>
                Donde el fuego<br />
                <span className={styles.conceptTitleGold}>es el protagonista</span>
              </h2>
              <p className={styles.conceptDesc}>
                Capitán Grill nació de una pasión simple: hacer de cada corte una experiencia memorable. 
                Seleccionamos piezas premium directamente del campo, las tratamos con respeto y las llevamos 
                al fuego con técnica y tradición norteña.
              </p>
              <p className={styles.conceptDesc}>
                Nuestro ambiente rústico no es casualidad — es el escenario perfecto para que el sabor 
                auténtico tome el centro. Sin artificios, sin pretensiones: solo carne, fuego y 
                la satisfacción de una parrilla bien ejecutada.
              </p>
              <p className={styles.conceptDesc}>
                Ubicados a pie de carretera en San Miguel de Allende, somos el destino de quienes 
                entienden que comer bien es un acto de cultura.
              </p>
            </div>
          </div>
        </section>

        {/* ── UBICACIÓN ── */}
        <section id="ubicacion" className={styles.locationSection}>
          <div className={styles.locationInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>Encuéntranos</span>
              <h2 className={styles.sectionTitle}>Ubicación & Contacto</h2>
            </div>

            <div className={styles.locationGrid}>
              <div className={styles.mapWrap}>
                <iframe
                  src={MAPS_EMBED}
                  className={styles.mapIframe}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Capitán Grill en Google Maps"
                />
                <div className={styles.mapOverlay} />
                <div className={styles.mapBadge}>
                  <MapPin size={14} />
                  Capitán Grill
                </div>
              </div>

              <div className={styles.contactStack}>
                <div className={cc.contactCard}>
                  <div className={cc.contactIcon}><Clock size={18} /></div>
                  <div className={cc.contactBody}>
                    <span className={cc.contactLabel}>Horario</span>
                    <span className={cc.contactValue}>{t('location.hours')}</span>
                  </div>
                </div>

                <div className={cc.contactCard}>
                  <div className={cc.contactIcon}><MapPin size={18} /></div>
                  <div className={cc.contactBody}>
                    <span className={cc.contactLabel}>Dirección</span>
                    <span className={cc.contactValue}>{t('location.address')}</span>
                  </div>
                </div>

                <a href="tel:+524151583036" className={cc.contactCard}>
                  <div className={cc.contactIcon}><Phone size={18} /></div>
                  <div className={cc.contactBody}>
                    <span className={cc.contactLabel}>Teléfono</span>
                    <span className={cc.contactValue}>{t('location.phone')}</span>
                  </div>
                </a>

                <div className={cc.contactActions}>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={cc.contactBtn}>
                    <MapPin size={15} />
                    Cómo llegar
                    <ExternalLink size={12} style={{ opacity: 0.5 }} />
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`${cc.contactBtn} ${cc.contactBtnWa}`}>
                    <WaIcon />
                    Reservar por WhatsApp
                  </a>
                </div>

                <div className={cc.contactSocial}>
                  <span className={cc.contactSocialLabel}>Síguenos</span>
                  <div className={cc.contactSocialBtns}>
                    <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={cc.socialIcon} title="Facebook"><FbIcon /></a>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={cc.socialIcon} title="Instagram"><IgIcon /></a>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={cc.socialIcon} title="WhatsApp"><WaIcon /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerLeft}>
              <span className={styles.footerBrand}>Capitán Grill</span>
              <span className={styles.footerSub}>Meat Boutique · San Miguel de Allende</span>
            </div>
            <div className={styles.footerLinks}>
              <button className={styles.footerLink} onClick={() => scrollTo('menu')}>Menú</button>
              <button className={styles.footerLink} onClick={() => scrollTo('concepto')}>Concepto</button>
              <button className={styles.footerLink} onClick={() => scrollTo('ubicacion')}>Ubicación</button>
            </div>
            <div className={styles.footerRight}>
              <p className={styles.footerCopy}>
                © {new Date().getFullYear()} Capitán Grill. {t('footer.rights')}
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}