import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../../hooks/useMenu';
import Loading from '../Loading';
import CategorySection from '../CategorySection/CategorySection';
import logo from '../../assets/logo/logo.png';
import styles from './MenuTab.module.css';

export default function MenuTab() {
  const { t, i18n } = useTranslation();
  const { categories, loading, refetch } = useMenu();
  const [activeCategoryId, setActiveCategoryId] = useState();

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  useEffect(() => {
    const channel = new BroadcastChannel('capitan_menu');
    channel.onmessage = () => refetch();
    return () => channel.close();
  }, [refetch]);

  if (loading) return <Loading />

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
              {t(`menu.categories.${cat.id}`)}
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