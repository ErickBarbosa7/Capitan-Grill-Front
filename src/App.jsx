import { useState } from 'react';
import { useMenu } from './hooks/useMenu';
import Header from './components/Header/Header';
import CategorySection from './components/CategorySection/CategorySection';
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

export default function App() {
  const { categories } = useMenu();
  // Estado para saber qué chip está activo (por defecto el primero)
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id);

  // Filtramos la categoría activa para mostrar solo esa
  const activeCategory = categories.find(c => c.id === activeCategoryId);

  return (
    <div className={styles.app}>
      <Header />
      
      {/* Navegación de Chips estilo App */}
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
        {/* Renderizamos SOLO la categoría seleccionada */}
        {activeCategory && (
          <CategorySection key={activeCategory.id} category={activeCategory} />
        )}
      </main>
      <Footer />
    </div>
  );
}