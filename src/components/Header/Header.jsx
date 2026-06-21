import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{t('header.title')}</h1>
      <p className={styles.subtitle}>{t('header.subtitle')}</p>
    </header>
  );
}
