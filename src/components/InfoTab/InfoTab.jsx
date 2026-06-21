import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Clock } from 'lucide-react';
import logo from '../../assets/logo.png';
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
            <a href="tel:+522216029780" className={styles.infoText}>{t('location.phone')}</a>
          </div>

          <div className={styles.infoItem}>
            <Clock size={20} className={styles.icon} />
            <p className={styles.infoText}>{t('location.hours')}</p>
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
