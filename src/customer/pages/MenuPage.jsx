import TopBar from '../components/TopBar/TopBar';
import MenuTab from '../components/MenuTab/MenuTab';
import styles from './MenuPage.module.css';

export default function MenuPage() {
  return (
    <div className={styles.page}>
      <TopBar />
      <main className={styles.content}>
        
        {/* ENCABEZADO HEREDADO DEL SISTEMA DE DISEÑO */}
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>La Selección</span>
          <h1 className={styles.pageTitle}>
            Nuestro <span className={styles.pageTitleAccent}>Menú</span>
          </h1>
          <p className={styles.pageLead}>
            Explora nuestra variedad de cortes de primera, guarniciones artesanales y bebidas preparadas para complementar tu experiencia al máximo.
          </p>
        </header>

        {/* CONTENIDO PRINCIPAL (El componente con tus pestañas de menú) */}
        <div className={styles.menuWrapper}>
          <MenuTab />
        </div>

      </main>
    </div>
  );
}