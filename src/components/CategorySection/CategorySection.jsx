import { useTranslation } from 'react-i18next';
import { Utensils } from 'lucide-react';
import MenuItem from '../MenuItem/MenuItem';
import styles from './CategorySection.module.css';

export default function CategorySection({ category }) {
  const { t } = useTranslation();
  const isCortes = category.id === 'cortes-finos';

  return (
    <section className={styles.section}>

      {/* Ornamento separador con nombre de categoría */}
      <div className={styles.catHeader}>
        <div className={styles.line} />
        <div className={styles.diamond} />
        <span className={styles.catLabel}>{t(`menu.categories.${category.id}`)}</span>
        <div className={styles.diamond} />
        <div className={styles.line} />
      </div>

      {/* Banner "incluye tortillas y salsa" solo en cortes */}
      {isCortes && (
        <div className={styles.includesBanner}>
          <Utensils size={14} className={styles.includesIcon} />
          <span className={styles.includesText}>
            {t('menu.includesBanner', 'Todos los cortes incluyen')}{' '}
            <strong>{t('menu.includesItems', 'tortillas y salsa')}</strong>
          </span>
        </div>
      )}

      <div className={styles.items}>
        {category.items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

    </section>
  );
}