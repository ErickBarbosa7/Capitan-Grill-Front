import TopBar from '../components/TopBar/TopBar';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <TopBar />
      <div className={styles.content}>
        <span className={styles.eyebrow}>Blog</span>
        <h1 className={styles.title}>Próximamente</h1>
        <p className={styles.text}>
          Estamos preparando contenido sobre cortes, parrilla y la experiencia Capitán Grill. ¡Muy pronto!
        </p>
      </div>
    </div>
  );
}
