import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, ExternalLink, Phone, Clock, Car } from 'lucide-react';
import styles from './LocationSection.module.css';

export default function LocationSection() {
  const { t } = useTranslation();

  const mapsEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.7508261920125!2d-100.7948010023266!3d21.020145436889177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b4fa8be9fef63%3A0x3dbe1b39bd01f9c6!2sCapitan%20Grill!5e0!3m2!1sen!2smx!4v1782318110505!5m2!1sen!2smx';
  const mapsRedirectUrl = 'https://maps.app.goo.gl/HVvjHMRtFRFWStQt7';
  const wazeRedirectUrl = 'https://waze.com/ul?q=Capitan+Grill+San+Miguel+de+Allende';

  return (
    <section className={styles.locationContainer}>

      {/* MAPA FULL-BLEED */}
      <div className={styles.mapWrapper}>
        <iframe
          src={mapsEmbedUrl}
          className={styles.mapIframe}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Capitán Grill Mapa"
        />
        {/* Degradado sobre el mapa */}
        <div className={styles.mapOverlay} />

        {/* Info encima del degradado */}
        <div className={styles.mapInfo}>
          <div className={styles.mapInfoLeft}>
            <h3 className={styles.locationName}>Capitán Grill</h3>
            <p className={styles.addressText}>
              <MapPin size={12} />
              {t('location.address')}
            </p>
          </div>
          <div className={styles.navBtns}>
            <a href={mapsRedirectUrl} target="_blank" rel="noopener noreferrer" className={styles.btnMaps}>
              <Navigation size={14} />
              {t('location.getDirectionsMaps')}
              <ExternalLink size={11} className={styles.externalIcon} />
            </a>
            <a href={wazeRedirectUrl} target="_blank" rel="noopener noreferrer" className={styles.btnWaze}>
              <Car size={14} />
              {t('location.getDirectionsWaze')}
              <ExternalLink size={11} className={styles.externalIcon} />
            </a>
          </div>
        </div>
      </div>

      {/* FRANJA INFERIOR: teléfono y horario */}
      <div className={styles.infoStrip}>
        <a href="tel:+524151583036" className={styles.infoItem}>
          <Phone size={16} className={styles.infoIcon} />
          <span className={styles.infoText}>
            <span className={styles.infoLabel}>Teléfono</span>
            {t('location.phone')}
          </span>
        </a>
        <div className={styles.infoItem}>
          <Clock size={16} className={styles.infoIcon} />
          <span className={styles.infoText}>
            <span className={styles.infoLabel}>Horario</span>
            {t('location.hours')}
          </span>
        </div>
      </div>

    </section>
  );
}