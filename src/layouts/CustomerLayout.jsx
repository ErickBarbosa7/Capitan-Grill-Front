import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav/BottomNav';
import styles from './CustomerLayout.module.css';

/* Layout exclusivo para móvil — desktop nunca llega aquí (lo maneja RootGuard) */
export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.replace('/', '') || 'menu';

  return (
    <div className={styles.mobileView}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <BottomNav activeTab={activeTab} onTabChange={(tab) => navigate(`/${tab}`)} />
    </div>
  );
}