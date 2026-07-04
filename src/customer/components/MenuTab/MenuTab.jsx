import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../../../hooks/useMenu';
import CategorySection from '../CategorySection/CategorySection';
import styles from './MenuTab.module.css';

export default function MenuTab() {
  const { i18n } = useTranslation();
  const { categories } = useMenu();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0]?.id);
    }
  }, [categories, activeCategoryId]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const scrollToCategory = (catId) => {
    setActiveCategoryId(catId);
    if (isDesktop) {
      document.getElementById(`menu-cat-${catId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.wrapper}>

      <nav className={styles.chipBar}>
        <div className={styles.chips}>
          {categories.map((cat) => {
            const lang = i18n.language;
            const catName = lang === 'en' ? (cat.nombreEn || cat.nombre) : (cat.nombreEs || cat.nombre);
            return (
              <button
                key={cat.id}
                className={`${styles.chip} ${activeCategoryId === cat.id ? styles.activeChip : ''}`}
                onClick={() => scrollToCategory(cat.id)}
              >
                {catName}
              </button>
            );
          })}
        </div>
      </nav>

      <main className={styles.main}>
        {isDesktop
          ? categories.map((cat) => <CategorySection key={cat.id} category={cat} />)
          : activeCategory && <CategorySection key={activeCategory.id} category={activeCategory} />
        }
      </main>
    </div>
  );
}
