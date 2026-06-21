import { Menu, Info, Share2 } from 'lucide-react';
import styles from './BottomNav.module.css';

const tabs = [
  { id: 'menu', label: 'Menú', icon: <Menu size={22} /> },
  { id: 'info', label: 'Info', icon: <Info size={22} /> },
  { id: 'social', label: 'Síguenos', icon: <Share2 size={22} /> },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
