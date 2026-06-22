import { useTranslation } from 'react-i18next';
import styles from './MenuItem.module.css';

export default function MenuItem({ item }) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.row} ${!item.disponible ? styles.soldOut : ''}`}>
      <div className={styles.left}>
        <p className={styles.name}>{item.nombre}</p>
        <p className={styles.desc}>{item.descripcion}</p>
        {!item.disponible && (
          <span className={styles.badge}>{t('menu.soldOut')}</span>
        )}
      </div>
      <div className={styles.dots} aria-hidden="true" />
      <span className={styles.price}>${item.precio.toFixed(0)}</span>
    </div>
  );
}
