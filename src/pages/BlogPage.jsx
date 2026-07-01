import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Regresar">
          <ArrowLeft size={18} />
        </button>
        <span className={styles.topBarTitle}>Capitán Grill</span>
      </header>
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
