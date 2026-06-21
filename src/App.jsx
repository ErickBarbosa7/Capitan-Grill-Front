import { useMenu } from './hooks/useMenu';
import Header from './components/Header/Header';
import CategorySection from './components/CategorySection/CategorySection';
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

export default function App() {
  const { categories } = useMenu();

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        {categories.map((categoria) => (
          <CategorySection key={categoria.id} category={categoria} />
        ))}
      </main>
      <Footer />
    </div>
  );
}
