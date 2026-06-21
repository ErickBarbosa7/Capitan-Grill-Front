import { useTranslation } from 'react-i18next';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section className={styles.about}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('about.title')}</h2>
        <p className={styles.description}>{t('about.description')}</p>
      </div>
    </section>
  );
}
