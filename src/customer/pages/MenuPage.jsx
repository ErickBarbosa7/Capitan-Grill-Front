import { useTranslation } from 'react-i18next';
import TopBar from '../components/TopBar/TopBar';
import MenuTab from '../components/MenuTab/MenuTab';
import styles from './MenuPage.module.css';

export default function MenuPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <TopBar />
      <main className={styles.content}>
        
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>{t('menuPage.eyebrow')}</span>
          <h1 className={styles.pageTitle}>
            {t('menuPage.titleBefore')} <span className={styles.pageTitleAccent}>{t('menuPage.titleAccent')}</span>
          </h1>
          <p className={styles.pageLead}>
            {t('menuPage.lead')}
          </p>
        </header>

        <div className={styles.menuWrapper}>
          <MenuTab />
        </div>

      </main>
    </div>
  );
}