import { useTranslation } from 'react-i18next';
import styles from './MenuItem.module.css';

export default function MenuItem({ item }) {
  const { t } = useTranslation();
  const name = item.nombreEs || item.nombre;
  const desc = item.descripcionEs || item.descripcion;

  return (
    <div className={`${styles.row} ${!item.disponible ? styles.soldOut : ''}`}>
      <div className={styles.topRow}>
        <p className={styles.name}>{name}</p>
        <span className={styles.price}>${item.precio.toFixed(0)}</span>
      </div>
      {desc && <p className={styles.desc}>{desc}</p>}
      {!item.disponible && (
        <span className={styles.badge}>{t('menu.soldOut')}</span>
      )}
    </div>
  );
}