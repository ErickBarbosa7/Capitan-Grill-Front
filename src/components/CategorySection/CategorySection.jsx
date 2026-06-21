import MenuItem from '../MenuItem/MenuItem';
import styles from './CategorySection.module.css';

export default function CategorySection({ category }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{category.nombre}</h2>
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
