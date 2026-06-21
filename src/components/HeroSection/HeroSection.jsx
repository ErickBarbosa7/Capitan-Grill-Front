import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';
import styles from './HeroSection.module.css';

export default function HeroSection({ onCtaClick }) {
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <img src={logo} alt="Capitán Grill" className={styles.logo} />
        <h1 className={styles.title}>{t('header.title')}</h1>
        <p className={styles.subtitle}>{t('header.subtitle')}</p>
        <button className={styles.cta} onClick={onCtaClick}>
          {t('hero.cta')}
        </button>
      </div>
    </section>
  );
}
