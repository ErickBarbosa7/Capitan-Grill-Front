import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../../hooks/useMenu';
import CategorySection from '../CategorySection/CategorySection';
import logo from '../../assets/logo.png';
import styles from './MenuTab.module.css';

export default function MenuTab() {
  const { t, i18n } = useTranslation();
  const { categories } = useMenu();
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
  };

  return (
    <div className={styles.wrapper}>
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
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {t(`menu.categories.${cat.id}`)}
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.main}>
        {activeCategory && (
          <CategorySection key={activeCategory.id} category={activeCategory} />
        )}
      </main>
    </div>
  );
}
