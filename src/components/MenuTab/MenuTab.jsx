import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenuContext } from '../../contexts/MenuContext';
import MenuSkeleton from '../MenuSkeleton/MenuSkeleton';
import CategorySection from '../CategorySection/CategorySection';
import { incrementMenuView } from '../../services/menuService';
import logo from '../../assets/logo/logo.png';
import styles from './MenuTab.module.css';

export default function MenuTab() {
  const { t, i18n } = useTranslation();
  const { categories, loading, refetch } = useMenuContext();
  const [activeCategoryId, setActiveCategoryId] = useState();

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  useEffect(() => {
    const counted = sessionStorage.getItem('capitan_menu_viewed');
    if (!counted) {
      incrementMenuView().catch(() => {});
      sessionStorage.setItem('capitan_menu_viewed', '1');
    }
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel('capitan_menu');
    let lastRefetch = 0;
    channel.onmessage = () => {
      const now = Date.now();
      if (now - lastRefetch > 2000) {
        lastRefetch = now;
        refetch();
      }
    };
    return () => channel.close();
  }, [refetch]);

  if (loading) return <MenuSkeleton />

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
  };

  return (
    <div className={styles.wrapper}>

      {/* Hero oscuro con logo */}
      <header className={styles.hero}>
        <button className={styles.langToggle} onClick={toggleLang} aria-label="Cambiar idioma">
          <span className={`${styles.lang} ${i18n.language === 'es' ? styles.activeLang : ''}`}>ES</span>
          <span className={styles.separator}>/</span>
          <span className={`${styles.lang} ${i18n.language === 'en' ? styles.activeLang : ''}`}>EN</span>
        </button>
        <img src={logo} alt="Capitán Grill" className={styles.logo} />
      </header>

      {/* Chipbar sticky */}
      <nav className={styles.chipBar}>
        <h2 className={styles.menuTitle}>{t('menu.title')}</h2>
        <div className={styles.chips}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.chip} ${activeCategoryId === cat.id ? styles.activeChip : ''}`}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.main}>
        {/* Banner Promocional del Gancho Comercial */}
        <div className={styles.promoBanner}>
          <h2 className={styles.promoTitle}>
            Cortes Finos <span className={styles.promoPrice}>$180</span>
          </h2>
          <p className={styles.promoSubtitle}>
            {t('menu.includesBanner')} <strong>{t('menu.includesItems')}</strong>
          </p>
        </div>

        {/* Categoría Activa */}
        {activeCategory && (
          <CategorySection key={activeCategory.id} category={activeCategory} />
        )}
      </main>

    </div>
  );
}