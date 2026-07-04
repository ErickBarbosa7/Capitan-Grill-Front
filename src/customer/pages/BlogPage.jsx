import { useTranslation } from 'react-i18next';
import TopBar from '../components/TopBar/TopBar';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <TopBar />
      <div className={styles.content}>
        <span className={styles.eyebrow}>{t('blog.eyebrow')}</span>
        <h1 className={styles.title}>{t('blog.title')}</h1>
        <p className={styles.text}>
          {t('blog.text')}
        </p>
      </div>
    </div>
  );
}
