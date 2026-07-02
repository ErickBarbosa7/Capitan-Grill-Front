import TopBar from '../components/TopBar/TopBar';
import MenuTab from '../components/MenuTab/MenuTab';
import styles from './MenuPage.module.css';

export default function MenuPage() {
  return (
    <div className={styles.page}>
      <TopBar />
      <main className={styles.main}>
        <div className={styles.headingWrap}>
          <h1 className={styles.heading}>Nuestro Menú</h1>
        </div>
        <MenuTab />
      </main>
    </div>
  );
}
