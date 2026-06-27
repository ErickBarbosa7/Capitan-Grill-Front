import { useTranslation } from 'react-i18next';
import { Menu, Info, Share2 } from 'lucide-react';
import styles from './BottomNav.module.css';

const icons = {
  menu: <Menu size={20} />,
  info: <Info size={20} />,
  social: <Share2 size={20} />,
};

export default function BottomNav({ activeTab, onTabChange }) {
  const { t } = useTranslation();
  const tabs = [
    { id: 'menu', label: t('nav.menu') },
    { id: 'info', label: t('nav.info') },
    { id: 'social', label: t('nav.social') },
  ];

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
          >
            <div className={styles.iconWrapper}>
              {icons[tab.id]}
            </div>
            <span className={styles.label}>{tab.label}</span>
            {activeTab === tab.id && <span className={styles.dot} />}
          </button>
        ))}
      </nav>
    </div>
  );
}