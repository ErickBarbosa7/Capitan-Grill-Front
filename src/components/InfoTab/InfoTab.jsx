import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, MessageCircle, X } from 'lucide-react';
import logo from '../../assets/logo.png';
import lugarImg from '../../assets/Lugar.jpg';
import lugar2 from '../../assets/lugar2.jpg';
import lugar3 from '../../assets/lugar3.jpg';
import lugarVideo from '../../assets/IMG_6038.MOV';
import styles from './InfoTab.module.css';

export default function InfoTab() {
  const { t } = useTranslation();
  // Estado para controlar qué recurso multimedia se muestra en el Lightbox
  const [lightboxMedia, setLightboxMedia] = useState(null); // { type: 'image' | 'video', src: string }

  return (
    <div className={styles.wrapper}>

      {/* ── Hero oscuro ── */}
      <header className={styles.hero}>
        <img src={logo} alt="Capitán Grill" className={styles.logo} />
        <p className={styles.heroName}>Capitán Grill</p>
        <div className={styles.heroPills}>
          <span className={styles.pill}>Meat Boutique</span>
          <span className={styles.pill}>El Sabor del Norte</span>
        </div>
      </header>

      {/* ── Collage ── */}
      <div className={styles.collageWrap}>
        <p className={styles.collageLabel}>{t('info.ourPlace', 'Nuestro Lugar')}</p>
        <div className={styles.collage}>
          <div className={styles.collageMain}>
            <div 
              className={styles.collageLink} 
              onClick={() => setLightboxMedia({ type: 'video', src: lugarVideo })}
              role="button"
              tabIndex={0}
            >
              <video className={styles.collageVideo} autoPlay muted loop playsInline>
                <source src={lugarVideo} type="video/quicktime" />
                <source src={lugarVideo} type="video/mp4" />
              </video>
              <span className={styles.collageOverlay}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
          </div>
          <div className={styles.collageSub}>
            <div 
              className={styles.collageLink} 
              onClick={() => setLightboxMedia({ type: 'image', src: lugarImg })}
              role="button"
              tabIndex={0}
            >
              <img src={lugarImg} alt="Capitán Grill" className={styles.collagePhoto} />
              <span className={styles.collageOverlay}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.expandIcon}>
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </div>
            <div 
              className={styles.collageLink} 
              onClick={() => setLightboxMedia({ type: 'image', src: lugar2 })}
              role="button"
              tabIndex={0}
            >
              <img src={lugar2} alt="Capitán Grill" className={styles.collagePhoto} />
              <span className={styles.collageOverlay}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.expandIcon}>
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </div>
            <div 
              className={styles.collageLink} 
              onClick={() => setLightboxMedia({ type: 'image', src: lugar3 })}
              role="button"
              tabIndex={0}
            >
              <img src={lugar3} alt="Capitán Grill" className={styles.collagePhoto} />
              <span className={styles.collageOverlay}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.expandIcon}>
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nuestra Historia ── */}
      <section className={styles.section}>
        <div className={styles.ornament}>
          <div className={styles.ornLine} />
          <div className={styles.ornDiamond} />
          <span className={styles.ornLabel}>{t('about.title')}</span>
          <div className={styles.ornDiamond} />
          <div className={styles.ornLine} />
        </div>
        <p className={styles.aboutText}>{t('about.description')}</p>
      </section>

      {/* ── Ubicación ── */}
      <section className={styles.section}>
        <div className={styles.ornament}>
          <div className={styles.ornLine} />
          <div className={styles.ornDiamond} />
          <span className={styles.ornLabel}>{t('location.title')}</span>
          <div className={styles.ornDiamond} />
          <div className={styles.ornLine} />
        </div>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>
              <MapPin size={16} />
            </div>
            <div className={styles.infoCardText}>
              <p>{t('location.address')}</p>
              <span>San Miguel de Allende, Gto.</span>
            </div>
          </div>

          <a href="https://wa.me/524151583036?text=Hola!%20Quisiera%20informes" target="_blank" rel="noopener noreferrer" className={styles.infoCard}>
            <div className={styles.infoCardIcon}>
              <MessageCircle size={16} />
            </div>
            <div className={styles.infoCardText}>
              <p>WhatsApp</p>
              <span>{t('location.tapToChat', 'Escríbenos directo')}</span>
            </div>
          </a>
        </div>
      </section>

      {/* ── Visor Lightbox (Pantalla Completa) ── */}
      {lightboxMedia && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxMedia(null)}>
          <button className={styles.closeButton} onClick={() => setLightboxMedia(null)} aria-label="Cerrar">
            <X size={26} color="#F7F5F0" />
          </button>
          
          {lightboxMedia.type === 'video' ? (
            <video 
              className={styles.lightboxMedia} 
              controls 
              autoPlay 
              playsInline 
              onClick={(e) => e.stopPropagation()}
            >
              <source src={lightboxMedia.src} type="video/quicktime" />
              <source src={lightboxMedia.src} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={lightboxMedia.src} 
              className={styles.lightboxMedia} 
              alt="Vista ampliada"
              onClick={(e) => e.stopPropagation()} 
            />
          )}
        </div>
      )}

    </div>
  );
}