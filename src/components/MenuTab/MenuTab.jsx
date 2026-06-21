import { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import CategorySection from '../CategorySection/CategorySection';
import logo from '../../assets/logo.png';
import styles from './MenuTab.module.css';

export default function MenuTab() {
  const { categories } = useMenu();
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <img src={logo} alt="Capitán Grill" className={styles.logo} />
      </header>

      <nav className={styles.chipBar}>
        <h2 className={styles.menuTitle}>Menú</h2>
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
        {activeCategory && (
          <CategorySection key={activeCategory.id} category={activeCategory} />
        )}
      </main>
    </div>
  );
}
