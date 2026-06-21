import { useTranslation } from 'react-i18next';
import styles from './MenuItem.module.css';

export default function MenuItem({ item }) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.card} ${!item.disponible ? styles.soldOut : ''}`}>
      
      {/* ESPACIO RESERVADO PARA IMAGENES REALES */}
      <div className={styles.imagePlaceholder}>
         {/* Un icono temporal divertido dependiendo de la categoría */}
         <span className={styles.imageIcon}>
           {item.id.startsWith('c') ? '🥩' : item.id.startsWith('e') ? '🧂' : '🍺'}
         </span>
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.name}>{t(`menu.items.${item.id}.name`)}</h3>
          <span className={styles.price}>${item.precio.toFixed(2)}</span>
        </div>
        
        <p className={styles.description}>{t(`menu.items.${item.id}.desc`)}</p>
        
        {!item.disponible && (
          <span className={styles.badge}>{t('menu.soldOut')}</span>
        )}
      </div>
    </div>
  );
}
