import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import LocationSection from '../LocationSection/LocationSection';
import ExperienceCard from '../ExperienceCard/ExperienceCard';
import cc from '../../styles/contact-cards.module.css';

import lugarImg from '../../assets/img/Lugar.jpg';
import lugar3 from '../../assets/img/lugar3.jpg';
import lugarVideo from '../../assets/img/IMG_6038.MOV';

import img1 from '../../assets/img/1.jpeg';
import img2 from '../../assets/img/2.jpeg';
import img3 from '../../assets/img/3.jpeg';
import img4 from '../../assets/img/4.jpeg';
import img5 from '../../assets/img/5.jpeg';

import styles from './InfoTab.module.css';

const FACEBOOK_URL = 'https://www.facebook.com/people/Capitangrill/100064038762789/';
const WHATSAPP_URL = 'https://wa.me/524151583036?text=Hola!%20Quisiera%20informes';
const INSTAGRAM_URL = 'https://www.instagram.com/capitan_grill.sma2026';
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

const mediaItems = [
  { type: 'video', src: lugarVideo, alt: 'Video del lugar' },
  { type: 'image', src: lugarImg, alt: 'Capitán Grill 1' },
  { type: 'image', src: lugar3, alt: 'Capitán Grill 2' },
];

const cutItems = [
  { src: img1 },
  { src: img2 },
  { src: img3 },
  { src: img4 },
  { src: img5 },
];

export default function InfoTab() {
  const { t, i18n } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(null);
  const videoRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchMoved = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;

      if (e.key === 'Escape') {
        handleClose();
      }

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrev();
      }

      if (e.key === 'ArrowRight' && currentIndex < mediaItems.length - 1) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex === null) return;

    const item = mediaItems[currentIndex];
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentIndex]);

  const handleOpen = (index) => {
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setCurrentIndex(null);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTouchStart = (e) => {
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) return;
    touchMoved.current = false;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) return;
    touchMoved.current = true;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) return;
    if (!touchMoved.current) {
      touchStartX.current = 0;
      touchEndX.current = 0;
      return;
    }
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < mediaItems.length - 1) {
        handleNext();
      } else if (diff < 0 && currentIndex > 0) {
        handlePrev();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const [activeCutIndex, setActiveCutIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleCutScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) { setActiveCutIndex(0); return; }
    const index = Math.round((scrollLeft / maxScroll) * (cutItems.length - 1));
    setActiveCutIndex(Math.min(index, cutItems.length - 1));
  };

  const scrollToCut = (index) => {
    if (!carouselRef.current) return;
    const { scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const targetLeft = (index / (cutItems.length - 1)) * maxScroll;
    carouselRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  const renderThumbnails = () => {
    return (
      <div className={styles.collage}>
        <div className={styles.collageMain}>
          <div
            className={styles.collageLink}
            onClick={() => handleOpen(0)}
            role="button"
            tabIndex={0}
          >
            <video
              className={styles.collageVideo}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={lugarVideo} type="video/quicktime" />
              <source src={lugarVideo} type="video/mp4" />
            </video>

            <span className={styles.collageOverlay}>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={styles.playIcon}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>

        <div className={styles.collageSub}>
          {mediaItems.slice(1).map((item, idx) => (
            <div
              key={idx}
              className={styles.collageLink}
              onClick={() => handleOpen(idx + 1)}
              role="button"
              tabIndex={0}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={styles.collagePhoto}
              />

              <span className={styles.collageOverlay}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={styles.expandIcon}
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      {/* ── Hero header (como MenuTab) ── */}
      <header className={styles.hero}>
        <button className={styles.langToggle} onClick={toggleLang}>
          <span className={`${styles.lang} ${i18n.language === 'es' ? styles.activeLang : ''}`}>ES</span>
          <span className={styles.separator}>/</span>
          <span className={`${styles.lang} ${i18n.language === 'en' ? styles.activeLang : ''}`}>EN</span>
        </button>
        <h1 className={styles.heroName}>Capitán Grill</h1>
        <p className={styles.collageLabel}>{t('header.subtitle')}</p>
      </header>

      {/* ── Collage: Nuestro Lugar ── */}
      <div className={styles.collageWrap}>
        <p className={styles.collageLabel}>
          {t('info.ourPlace', 'Nuestro Lugar')}
        </p>
        {renderThumbnails()}
      </div>

      {/* ── Nuestra Experiencia ── */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>{t('experience.eyebrow')}</p>

        <div className={styles.experienceCards}>
          {t('experience.cards', { returnObjects: true }).map((card, i) => (
            <ExperienceCard
              key={i}
              number={`0${i + 1}`}
              title={card.title}
              description={card.description}
              detail={card.detail}
            />
          ))}
        </div>
      </section>

      {/* ── Nuestros Cortes ── */}
      <section className={styles.cutsSection}>
        <p className={styles.collageLabel}>
          {t('info.cuts.title', 'Nuestros Cortes')}
        </p>

        <div className={styles.cutsCarouselWrap}>
          <div
            ref={carouselRef}
            className={styles.cutsCarousel}
            onScroll={handleCutScroll}
          >
            {cutItems.map((item, idx) => (
              <div key={idx} className={styles.cutCard}>
                <img
                  src={item.src}
                  alt={`Corte ${idx + 1}`}
                  className={styles.cutImage}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {cutItems.length > 1 && (
            <>
              {activeCutIndex > 0 && (
                <button
                  className={`${styles.cutsArrow} ${styles.cutsArrowLeft}`}
                  onClick={() => scrollToCut(activeCutIndex - 1)}
                  aria-label="Anterior"
                >
                  <ChevronLeft size={24} color="#F7F5F0" />
                </button>
              )}
              {activeCutIndex < cutItems.length - 1 && (
                <button
                  className={`${styles.cutsArrow} ${styles.cutsArrowRight}`}
                  onClick={() => scrollToCut(activeCutIndex + 1)}
                  aria-label="Siguiente"
                >
                  <ChevronRight size={24} color="#F7F5F0" />
                </button>
              )}

              <div className={styles.cutsDots}>
                {cutItems.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.cutDot} ${idx === activeCutIndex ? styles.cutDotActive : ''}`}
                    onClick={() => scrollToCut(idx)}
                    aria-label={`Ir al corte ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Ubicación & Contacto ── */}
      <div className={styles.section}>
        <LocationSection />

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.infoCard}
        >
          <div className={styles.infoCardIcon}>
            <MessageCircle size={16} />
          </div>
          <div className={styles.infoCardText}>
            <p>WhatsApp</p>
            <span>
              {t('location.tapToChat', 'Escríbenos directo')}
            </span>
          </div>
        </a>
      </div>

      {currentIndex !== null && (
        <div
          className={styles.lightboxOverlay}
          onClick={handleClose}
        >
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar"
          >
            <X size={26} color="#F7F5F0" />
          </button>

          {currentIndex > 0 && (
            <button
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              <ChevronLeft size={32} color="#F7F5F0" />
            </button>
          )}

          {currentIndex < mediaItems.length - 1 && (
            <button
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight size={32} color="#F7F5F0" />
            </button>
          )}

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {mediaItems[currentIndex].type === 'video' ? (
              <video
                ref={videoRef}
                className={styles.lightboxMedia}
                controls
                autoPlay
                playsInline
                onClick={(e) => e.stopPropagation()}
              >
                <source
                  src={mediaItems[currentIndex].src}
                  type="video/quicktime"
                />
                <source
                  src={mediaItems[currentIndex].src}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={mediaItems[currentIndex].src}
                alt={mediaItems[currentIndex].alt}
                className={styles.lightboxMedia}
              />
            )}
          </div>

          <div className={styles.paginationDots}>
            {mediaItems.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.dot} ${
                  idx === currentIndex ? styles.dotActive : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}