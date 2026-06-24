import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../../hooks/useMenu';
import CategorySection from '../CategorySection/CategorySection';
import logo from '../../assets/logo.png';
import styles from './MenuTab.module.css';

export default function MenuTab({ wide }) {
  const { t, i18n } = useTranslation();
<<<<<<< Updated upstream
  const { categories } = useMenu();
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id);
=======
  const { categories, loading, refetch } = useMenuContext();
  const [activeCategoryId, setActiveCategoryId] = useState();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
>>>>>>> Stashed changes

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
  };

  return (
<<<<<<< Updated upstream
    <div className={styles.wrapper}>
=======
    <div className={`${styles.wrapper} ${wide ? styles.wide : ''}`}>

      {/* Hero oscuro con logo */}
>>>>>>> Stashed changes
      <header className={styles.hero}>
        <button className={styles.langToggle} onClick={toggleLang}>
          <span className={`${styles.lang} ${i18n.language === 'es' ? styles.activeLang : ''}`}>ES</span>
          <span className={styles.separator}>/</span>
          <span className={`${styles.lang} ${i18n.language === 'en' ? styles.activeLang : ''}`}>EN</span>
        </button>
        <img src={logo} alt="Capitán Grill" className={styles.logo} />
      </header>

      <nav className={styles.chipBar}>
        <h2 className={styles.menuTitle}>{t('menu.title')}</h2>
        <div className={styles.chips}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.chip} ${activeCategoryId === cat.id ? styles.activeChip : ''}`}
              onClick={() => {
                setActiveCategoryId(cat.id);
                if (isDesktop) {
                  document.getElementById(`menu-cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {t(`menu.categories.${cat.id}`)}
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.main}>
<<<<<<< Updated upstream
        {activeCategory && (
          <CategorySection key={activeCategory.id} category={activeCategory} />
        )}
=======
        {/* Banner Promocional del Gancho Comercial */}
        <div className={styles.promoBanner}>
          <h2 className={styles.promoTitle}>
            {categories.find(c => c.id === 'cortes')?.nombre || 'Cortes'} <span className={styles.promoPrice}>$190</span>
          </h2>
          <p className={styles.promoSubtitle}>
            {t('menu.includesBanner')} <strong>{t('menu.includesItems')}</strong>
          </p>
        </div>

        {/* Categorías: en desktop todas visibles, en mobile solo la activa */}
        {isDesktop
          ? categories.map((cat) => (
              <div key={cat.id} id={`menu-cat-${cat.id}`}>
                <CategorySection category={cat} />
              </div>
            ))
          : activeCategory && (
              <CategorySection key={activeCategory.id} category={activeCategory} />
            )}
>>>>>>> Stashed changes
      </main>
    </div>
  );
}
