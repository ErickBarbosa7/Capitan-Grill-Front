import { useState } from 'react';
import BottomNav from './components/BottomNav/BottomNav';
import MenuTab from './components/MenuTab/MenuTab';
import InfoTab from './components/InfoTab/InfoTab';
import SocialTab from './components/SocialTab/SocialTab.jsx';
import styles from './App.module.css';

const TABS = {
  menu: MenuTab,
  info: InfoTab,
  social: SocialTab,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');

  const ActiveComponent = TABS[activeTab];

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <ActiveComponent />
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}