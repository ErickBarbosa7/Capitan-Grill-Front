import { useState, useRef } from 'react';
import { useMenu } from './hooks/useMenu';
import HeroSection from './components/HeroSection/HeroSection';
import AboutSection from './components/AboutSection/AboutSection';
import CategorySection from './components/CategorySection/CategorySection';
import LocationSection from './components/LocationSection/LocationSection';
import SocialSection from './components/SocialSection/SocialSection';
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

export default function App() {
  const { categories } = useMenu();
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id);
  const menuRef = useRef(null);

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.app}>
      <HeroSection onCtaClick={scrollToMenu} />
      <AboutSection />

      <div ref={menuRef} className={styles.menuSection}>
        <nav className={styles.chipScroll}>
          <div className={styles.chipsContainer}>
            {categories.map((categoria) => (
              <button
                key={categoria.id}
                className={`${styles.chip} ${activeCategoryId === categoria.id ? styles.activeChip : ''}`}
                onClick={() => setActiveCategoryId(categoria.id)}
              >
                {categoria.nombre}
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

      <LocationSection />
      <SocialSection />
      <Footer />
    </div>
  );
}
