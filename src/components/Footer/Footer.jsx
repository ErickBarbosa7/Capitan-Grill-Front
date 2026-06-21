import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {year} Capitán Grill. {t('footer.rights')}</p>
    </footer>
  );
}
