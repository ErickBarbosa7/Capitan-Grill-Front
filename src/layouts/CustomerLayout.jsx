import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Info, Share2 } from 'lucide-react';
import styles from './CustomerLayout.module.css';

const tabs = ['menu', 'info', 'social'];

const icons = {
  menu: <Menu size={22} />,
  info: <Info size={22} />,
  social: <Share2 size={22} />,
};

export default function CustomerLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.replace('/', '') || 'menu';

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Outlet />
      </div>

      <nav className={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => navigate(`/${tab}`)}
          >
            <span className={styles.icon}>{icons[tab]}</span>
            <span className={styles.label}>{t(`nav.${tab}`)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
