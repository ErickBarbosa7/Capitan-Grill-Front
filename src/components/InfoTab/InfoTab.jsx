import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

import logo from '../../assets/logo/logo.png';
import lugarImg from '../../assets/img/Lugar.jpg';
import lugar3 from '../../assets/img/lugar3.jpg';
import lugarVideo from '../../assets/img/IMG_6038.MOV';

import styles from './InfoTab.module.css';

const mediaItems = [
  { type: 'video', src: lugarVideo, alt: 'Video del lugar' },
  { type: 'image', src: lugarImg, alt: 'Capitán Grill 1' },
  { type: 'image', src: lugar3, alt: 'Capitán Grill 2' },
];

export default function InfoTab() {
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(null);
  const videoRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) return;
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
      <header className={styles.hero}>
        <img src={logo} alt="Capitán Grill" className={styles.logo} />

        <p className={styles.heroName}>Capitán Grill</p>

        <div className={styles.heroPills}>
          <span className={styles.pill}>Meat Boutique</span>
          <span className={styles.pill}>El Sabor del Norte</span>
        </div>
      </header>

      <div className={styles.collageWrap}>
        <p className={styles.collageLabel}>
          {t('info.ourPlace', 'Nuestro Lugar')}
        </p>

        {renderThumbnails()}
      </div>

      <section className={styles.section}>
        <div className={styles.ornament}>
          <div className={styles.ornLine} />
          <div className={styles.ornDiamond} />
          <span className={styles.ornLabel}>
            {t('about.title')}
          </span>
          <div className={styles.ornDiamond} />
          <div className={styles.ornLine} />
        </div>

        <p className={styles.aboutText}>
          {t('about.description')}
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.ornament}>
          <div className={styles.ornLine} />
          <div className={styles.ornDiamond} />
          <span className={styles.ornLabel}>
            {t('location.title')}
          </span>
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

          <a
            href="https://wa.me/524151583036?text=Hola!%20Quisiera%20informes"
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
      </section>

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