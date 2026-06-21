import { useTranslation } from 'react-i18next';
import styles from './LocationSection.module.css';

export default function LocationSection() {
  const { t } = useTranslation();

  const mapSrc = "https://maps.google.com/maps?q=37880+Santuario+de+atotonilco,+37880+San+Miguel+de+Allende,+Gto.&output=embed";

  return (
    <section className={styles.location}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('location.title')}</h2>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className={styles.infoText}>{t('location.address')}</p>
          </div>

          <div className={styles.infoItem}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <a href="tel:+522216029780" className={styles.infoText}>{t('location.phone')}</a>
          </div>

          <div className={styles.infoItem}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
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
      </div>
    </section>
  );
}
