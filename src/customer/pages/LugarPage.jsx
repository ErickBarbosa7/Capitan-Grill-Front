import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import lugarImg from '../../assets/img/Lugar.jpg';
import lugar3 from '../../assets/img/lugar3.jpg';
import img1 from '../../assets/img/1.jpeg';
import img2 from '../../assets/img/3.jpeg';
import img3 from '../../assets/img/5.jpeg';
import img4 from '../../assets/img/6.jpg';

import styles from './LugarPage.module.css';
import TopBar from '../components/TopBar/TopBar';
import { optimizeVideoUrl } from '../../utils/cloudinary';

const LUGAR_VIDEO = optimizeVideoUrl('https://res.cloudinary.com/gn00jygp/video/upload/v1/videos/lugar');
const CORTES_VIDEO = optimizeVideoUrl('https://res.cloudinary.com/gn00jygp/video/upload/v1/videos/cortes');

const mediaItems = [
  { type: 'video', src: LUGAR_VIDEO, alt: 'Video del lugar' },
  { type: 'image', src: lugarImg, alt: 'Capitán Grill 1' },
  { type: 'image', src: lugar3, alt: 'Capitán Grill 2' },
];

export default function LugarPage() {
  const { t } = useTranslation();

  const cutItems = [
    { type: 'image', src: img1, name: t('lugarPage.cutItems.0.name'), note: t('lugarPage.cutItems.0.note') },
    { type: 'image', src: img2, name: t('lugarPage.cutItems.1.name'), note: t('lugarPage.cutItems.1.note') },
    { type: 'image', src: img3, name: t('lugarPage.cutItems.2.name'), note: t('lugarPage.cutItems.2.note') },
    { type: 'image', src: img4, name: t('lugarPage.cutItems.3.name'), note: t('lugarPage.cutItems.3.note') },
    { type: 'video', src: CORTES_VIDEO, name: t('lugarPage.cutItems.4.name'), note: t('lugarPage.cutItems.4.note') },
  ];

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

      <main className={styles.content}>

        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>{t('lugarPage.eyebrow')}</span>
          <h1 className={styles.pageTitle}>
            {t('lugarPage.titleBefore')} <span className={styles.pageTitleAccent}>{t('lugarPage.titleAccent')}</span>
          </h1>
          <p className={styles.pageLead}>
            {t('lugarPage.lead')}
          </p>
        </header>

        {/* BENTO GRID */}
        <section className={styles.bentoGrid}>

          <div className={`${styles.bentoCell} ${styles.bentoVideo}`}>
            <video
              src={mediaItems[0].src}
              className={styles.bentoMedia}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className={styles.bentoOverlay} onClick={() => handleOpen(0)} role="button" tabIndex={0}>
              <span className={styles.playBadge}>
                <Play size={18} fill="currentColor" />
              </span>
            </div>
            <div className={styles.bentoTag}>{t('lugarPage.bento.tag')}</div>
          </div>

          <div className={`${styles.bentoCell} ${styles.bentoStory}`}>
            <span className={styles.bentoStoryEyebrow}>{t('lugarPage.bento.eyebrow')}</span>
            <h3 className={styles.bentoStoryTitle}>{t('lugarPage.bento.title')}</h3>
            <p className={styles.bentoStoryText}>
              {t('lugarPage.bento.text')}
            </p>
          </div>

          {mediaItems.slice(1).map((item, idx) => (
            <div key={idx} className={`${styles.bentoCell} ${styles.bentoPhoto}`}>
              <img src={item.src} alt={item.alt} className={styles.bentoMedia} />
              <div className={styles.bentoOverlay} onClick={() => handleOpen(idx + 1)} role="button" tabIndex={0}>
                <span className={styles.zoomBadge}>
                  <Maximize2 size={16} />
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.cutsSection}>
          <div className={styles.sectionHeadRow}>
            <span className={styles.eyebrow}>{t('lugarPage.cuts.eyebrow')}</span>
            <h2 className={styles.sectionTitle}>{t('lugarPage.cuts.title')}</h2>
          </div>

          <div className={styles.carouselContainer}>
            <div ref={carouselRef} className={styles.carouselTrack} onScroll={handleCutScroll}>
              {cutItems.map((item, idx) => (
                <article key={idx} className={styles.cutCard}>
                  <div className={styles.cutImageWrapper}>
                    {/* CONDICIONAL: ¿Es video o imagen? */}
                    {item.type === 'video' ? (
                      <video 
                        src={item.src} 
                        className={styles.cutImage} 
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                      />
                    ) : (
                      <img 
                        src={item.src} 
                        alt={item.name} 
                        className={styles.cutImage} 
                        loading="lazy" 
                      />
                    )}
                    <span className={styles.cutIndex}>{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div className={styles.cutInfo}>
                    <h4 className={styles.cutTitle}>{item.name}</h4>
                    <p className={styles.cutNote}>{item.note}</p>
                  </div>
                </article>
              ))}
            </div>

            {cutItems.length > 1 && (
              <>
                {activeCutIndex > 0 && (
                  <button className={`${styles.cutsArrow} ${styles.cutsArrowLeft}`} onClick={() => scrollToCut(activeCutIndex - 1)} aria-label={t('aria.previous')}>
                    <ChevronLeft size={20} />
                  </button>
                )}
                {activeCutIndex < cutItems.length - 1 && (
                  <button className={`${styles.cutsArrow} ${styles.cutsArrowRight}`} onClick={() => scrollToCut(activeCutIndex + 1)} aria-label={t('aria.next')}>
                    <ChevronRight size={20} />
                  </button>
                )}
                <div className={styles.cutsDots}>
                  {cutItems.map((_, idx) => (
                    <button
                      key={idx}
                      className={`${styles.cutDot} ${idx === activeCutIndex ? styles.cutDotActive : ''}`}
                      onClick={() => scrollToCut(idx)}
                      aria-label={t('aria.goToImage', { number: idx + 1 })}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* LIGHTBOX */}
      {currentIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={handleClose}>
          <button className={styles.closeButton} onClick={handleClose} aria-label={t('aria.close')}>
            <X size={22} />
          </button>

          {currentIndex > 0 && (
            <button className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
              <ChevronLeft size={28} />
            </button>
          )}

          {currentIndex < mediaItems.length - 1 && (
            <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={(e) => { e.stopPropagation(); handleNext(); }}>
              <ChevronRight size={28} />
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
              <video ref={videoRef} src={mediaItems[currentIndex].src} className={styles.lightboxMedia} controls autoPlay playsInline onClick={(e) => e.stopPropagation()} />
            ) : (
              <img src={mediaItems[currentIndex].src} alt={mediaItems[currentIndex].alt} className={styles.lightboxMedia} />
            )}
          </div>

          <div className={styles.paginationDots}>
            {mediaItems.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}