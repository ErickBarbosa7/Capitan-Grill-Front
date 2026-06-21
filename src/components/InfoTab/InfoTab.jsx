import { useTranslation } from 'react-i18next';
import { MapPin, Phone } from 'lucide-react';
import logo from '../../assets/logo.png';
import lugarImg from '../../assets/Lugar.jpg';
import lugar2 from '../../assets/lugar2.jpg';
import lugar3 from '../../assets/lugar3.jpg';
import lugarVideo from '../../assets/IMG_6038.MOV';
import styles from './InfoTab.module.css';

export default function InfoTab() {
  const { t } = useTranslation();

  const mapSrc =
    'https://maps.google.com/maps?q=37880+Santuario+de+atotonilco,+37880+San+Miguel+de+Allende,+Gto.&output=embed';

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <img src={logo} alt="Capitán Grill" className={styles.logo} />
        <p className={styles.slogan}>{t('header.subtitle')}</p>
      </div>

      <div className={styles.collage}>
        <div className={styles.collageMain}>
          <a href={lugarVideo} target="_blank" rel="noopener noreferrer" className={styles.collageLink}>
            <video className={styles.collageVideo} autoPlay muted loop playsInline>
              <source src={lugarVideo} type="video/quicktime" />
              <source src={lugarVideo} type="video/mp4" />
            </video>
            <span className={styles.collageOverlay}>
              <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </a>
          <a href={lugarImg} target="_blank" rel="noopener noreferrer" className={styles.collageLink}>
            <img src={lugarImg} alt="Capitán Grill" className={styles.collagePhoto} />
            <span className={styles.collageOverlay}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.expandIcon}>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </a>
        </div>
        <div className={styles.collageSub}>
          <a href={lugar2} target="_blank" rel="noopener noreferrer" className={styles.collageLink}>
            <img src={lugar2} alt="Capitán Grill" className={styles.collagePhoto} />
            <span className={styles.collageOverlay}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.expandIcon}>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </a>
          <a href={lugar3} target="_blank" rel="noopener noreferrer" className={styles.collageLink}>
            <img src={lugar3} alt="Capitán Grill" className={styles.collagePhoto} />
            <span className={styles.collageOverlay}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.expandIcon}>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('about.title')}</h2>
        <p className={styles.description}>{t('about.description')}</p>
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('location.title')}</h2>

        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <MapPin size={20} className={styles.icon} />
            <p className={styles.infoText}>{t('location.address')}</p>
          </div>

          <div className={styles.infoItem}>
            <Phone size={20} className={styles.icon} />
            <a href="tel:+524151583036" className={styles.infoText}>{t('location.phone')}</a>
          </div>

        </div>

        <div className={styles.mapContainer}>
          <iframe
            title="Ubicación Capitán Grill"
            src={mapSrc}
            className={styles.map}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
