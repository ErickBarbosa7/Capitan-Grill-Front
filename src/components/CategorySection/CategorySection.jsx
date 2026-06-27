import { useTranslation } from 'react-i18next';
import MenuItem from '../MenuItem/MenuItem';
import styles from './CategorySection.module.css';

export default function CategorySection({ category }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const catName = lang === 'en' ? (category.nombreEn || category.nombre) : (category.nombreEs || category.nombre);

  return (
    <section className={styles.section} id={`menu-cat-${category.id}`}>
      <div className={styles.catHeader}>
        <span className={styles.catLabel}>{catName}</span>
      </div>
      <div className={styles.items}>
        {category.items.filter(i => i.disponible !== false).map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}