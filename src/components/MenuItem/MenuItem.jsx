import { useTranslation } from 'react-i18next';
import styles from './MenuItem.module.css';

export default function MenuItem({ item }) {
  const { t } = useTranslation();

  return (
    <div
      className={`${styles.item} ${!item.disponible ? styles.soldOut : ''}`}
    >
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{item.nombre}</h3>
          {!item.disponible && (
            <span className={styles.badge}>{t('menu.soldOut')}</span>
          )}
        </div>
        <p className={styles.description}>{item.descripcion}</p>
      </div>
      <span className={styles.price}>${item.precio.toFixed(2)}</span>
    </div>
  );
}
