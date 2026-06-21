import { useTranslation } from 'react-i18next';
import MenuItem from '../MenuItem/MenuItem';
import styles from './CategorySection.module.css';

export default function CategorySection({ category }) {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t(`menu.categories.${category.id}`)}</h2>
      {category.descripcion && (
        <p className={styles.description}>{category.descripcion}</p>
      )}
      <div className={styles.items}>
        {category.items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
