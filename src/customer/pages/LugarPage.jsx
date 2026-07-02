import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import lugarImg from '../../assets/img/Lugar.jpg';
import lugar3 from '../../assets/img/lugar3.jpg';
import lugarVideo from '../../assets/img/IMG_6038.MOV';

import img1 from '../../assets/img/1.jpeg';
import img2 from '../../assets/img/2.jpeg';
import img3 from '../../assets/img/3.jpeg';
import img4 from '../../assets/img/4.jpeg';
import img5 from '../../assets/img/5.jpeg';

import styles from './LugarPage.module.css';

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

import TopBar from '../components/TopBar/TopBar';

export default function LugarPage() {
  const { t, i18n } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(null);
  const videoRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchMoved = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) handlePrev();
      if (e.key === 'ArrowRight' && currentIndex < mediaItems.length - 1) handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    document.body.style.overflow = currentIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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

  const handleOpen = (index) => setCurrentIndex(index);
  const handleClose = () => setCurrentIndex(null);
  const handlePrev = () => setCurrentIndex((prev) => prev - 1);
  const handleNext = () => setCurrentIndex((prev) => prev + 1);

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

  const handleTouchEnd = () => {
    if (touchMoved.current) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < mediaItems.length - 1) handleNext();
        else if (diff < 0 && currentIndex > 0) handlePrev();
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

  return (
    <div className={styles.page}>
      <TopBar />
      <div className={styles.headingWrap}>
        <h1 className={styles.heading}>Nuestro Lugar</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.collage}>
          <div className={styles.collageMain}>
            <div className={styles.collageLink} onClick={() => handleOpen(0)} role="button" tabIndex={0}>
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
            {mediaItems.slice(1).map((item, idx) => (
              <div key={idx} className={styles.collageLink} onClick={() => handleOpen(idx + 1)} role="button" tabIndex={0}>
                <img src={item.src} alt={item.alt} className={styles.collagePhoto} />
                <span className={styles.collageOverlay}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.expandIcon}>
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.cutsSection}>
        <h2 className={styles.sectionHeading}>Nuestros Cortes</h2>
        <div className={styles.cutsCarouselWrap}>
          <div ref={carouselRef} className={styles.cutsCarousel} onScroll={handleCutScroll}>
            {cutItems.map((item, idx) => (
              <div key={idx} className={styles.cutCard}>
                <img src={item.src} alt={`Corte ${idx + 1}`} className={styles.cutImage} loading="lazy" />
              </div>
            ))}
          </div>
          {cutItems.length > 1 && (
            <>
              {activeCutIndex > 0 && (
                <button className={`${styles.cutsArrow} ${styles.cutsArrowLeft}`} onClick={() => scrollToCut(activeCutIndex - 1)} aria-label="Anterior">
                  <ChevronLeft size={24} />
                </button>
              )}
              {activeCutIndex < cutItems.length - 1 && (
                <button className={`${styles.cutsArrow} ${styles.cutsArrowRight}`} onClick={() => scrollToCut(activeCutIndex + 1)} aria-label="Siguiente">
                  <ChevronRight size={24} />
                </button>
              )}
              <div className={styles.cutsDots}>
                {cutItems.map((_, idx) => (
                  <button key={idx} className={`${styles.cutDot} ${idx === activeCutIndex ? styles.cutDotActive : ''}`} onClick={() => scrollToCut(idx)} aria-label={`Ir al corte ${idx + 1}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {currentIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={handleClose}>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar"><X size={26} /></button>
          {currentIndex > 0 && (
            <button className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={(e) => { e.stopPropagation(); handlePrev(); }}><ChevronLeft size={32} /></button>
          )}
          {currentIndex < mediaItems.length - 1 && (
            <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={(e) => { e.stopPropagation(); handleNext(); }}><ChevronRight size={32} /></button>
          )}
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {mediaItems[currentIndex].type === 'video' ? (
              <video ref={videoRef} className={styles.lightboxMedia} controls autoPlay playsInline onClick={(e) => e.stopPropagation()}>
                <source src={mediaItems[currentIndex].src} type="video/quicktime" />
                <source src={mediaItems[currentIndex].src} type="video/mp4" />
              </video>
            ) : (
              <img src={mediaItems[currentIndex].src} alt={mediaItems[currentIndex].alt} className={styles.lightboxMedia} />
            )}
          </div>
          <div className={styles.paginationDots}>
            {mediaItems.map((_, idx) => (
              <span key={idx} className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
