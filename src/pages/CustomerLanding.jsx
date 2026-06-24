import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Award, Clock, MapPin, Phone, ChevronDown, UtensilsCrossed } from 'lucide-react';
import MenuTab from '../components/MenuTab/MenuTab';
import heroImg from '../assets/img/Lugar.jpg';
import styles from './CustomerLanding.module.css';

const FACEBOOK_URL = 'https://www.facebook.com/people/Capitangrill/100064038762789/';
const WHATSAPP_URL = 'https://wa.me/524151583036?text=Hola!%20Quisiera%20informes';
const INSTAGRAM_URL = 'https://www.instagram.com/capitan_grill.sma2026';

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CustomerLanding() {
  const { t } = useTranslation();

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.page}>
      {/* ─── HERO ─── */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${heroImg})` }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.topBar}>Capitán Grill</span>

          <div className={styles.heroMain}>
            <span className={styles.pillBadge}>🔥 Fuego y Naturaleza</span>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroGold}>Simply Capitán,</span>
              <br />
              <span className={styles.heroCream}>Truly Exceptional</span>
            </h1>
            <p className={styles.heroDesc}>
              Capitan Grill · Meat Boutique. Cortes finos a la parrilla en un entorno rústico que celebra el sabor del norte.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={() => scrollTo('menu')}>
                <UtensilsCrossed size={18} />
                Ver Menú
              </button>
              <button className={styles.btnSecondary} onClick={() => scrollTo('info')}>
                Nuestra Historia
              </button>
            </div>
          </div>

          <div className={styles.featureCards}>
            <div className={styles.featureCard}>
              <div className={styles.featureCardIcon}><Flame size={20} /></div>
              <h4 className={styles.featureCardTitle}>De la Granja al Fuego</h4>
              <p className={styles.featureCardText}>Seleccionamos los mejores cortes directamente del campo a tu mesa.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureCardIcon}><Award size={20} /></div>
              <h4 className={styles.featureCardTitle}>Maestros Parrilleros</h4>
              <p className={styles.featureCardText}>Técnica y tradición en cada término, ejecutada por expertos.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureCardIcon}><Clock size={20} /></div>
              <h4 className={styles.featureCardTitle}>Siempre Caliente</h4>
              <p className={styles.featureCardText}>Servicio impecable, directo de la parrilla a tu plato.</p>
            </div>
          </div>

          <div className={styles.socialFooter}>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Facebook">
              <FacebookIcon />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Instagram">
              <InstagramIcon />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="WhatsApp">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ─── MENÚ ─── */}
      <section id="menu" className={styles.menuSection}>
        <div className={styles.menuInner}>
          <span className={styles.sectionLabel}>Nuestra Carta</span>
          <h2 className={styles.sectionTitle}>Nuestros Cortes</h2>
          <MenuTab wide />
        </div>
      </section>

      {/* ─── INFO ─── */}
      <section id="info" className={styles.infoSection}>
        <div className={styles.infoInner}>
          <span className={styles.sectionLabel}>Capitan Grill</span>
          <h2 className={styles.sectionTitle}>Meat Boutique</h2>
          <p className={styles.infoDesc}>{t('about.description')}</p>

          <div className={styles.infoCards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}><Clock size={22} /></div>
              <h3 className={styles.cardTitle}>Horarios</h3>
              <p className={styles.cardText}>{t('location.hours')}</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><MapPin size={22} /></div>
              <h3 className={styles.cardTitle}>Ubicación</h3>
              <p className={styles.cardText}>{t('location.address')}</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><Phone size={22} /></div>
              <h3 className={styles.cardTitle}>Reservas</h3>
              <p className={styles.cardText}>{t('location.phone')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
