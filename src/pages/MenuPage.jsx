import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import MenuTab from '../components/MenuTab/MenuTab';
import styles from './MenuPage.module.css';

const WHATSAPP_URL = 'https://wa.me/524152826863?text=Hola!%20Quisiera%20informes';

export default function MenuPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Regresar">
            <ArrowLeft size={18} />
          </button>
          <span className={styles.topBarLogo}>Capitán Grill</span>
        </div>
        <div className={styles.topBarRight}>
          <button className={styles.langToggle} onClick={toggleLang} aria-label="Cambiar idioma">
            <span className={`${styles.lang} ${i18n.language === 'es' ? styles.langActive : ''}`}>ES</span>
            <span className={styles.langSep}>/</span>
            <span className={`${styles.lang} ${i18n.language === 'en' ? styles.langActive : ''}`}>EN</span>
          </button>
          <a href={WHATSAPP_URL} className={styles.topBarWa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <MessageCircle size={18} />
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <MenuTab />
      </main>
    </div>
  );
}
