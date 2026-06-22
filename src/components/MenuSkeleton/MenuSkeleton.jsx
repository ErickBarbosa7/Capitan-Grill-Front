import styles from './MenuSkeleton.module.css'

const ITEM_ROWS = 4

export default function MenuSkeleton() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <div className={styles.langToggle}>
          <span className={styles.langPill} />
          <span className={styles.langSep} />
          <span className={styles.langPill} />
        </div>
        <div className={styles.logo} />
      </header>

      <nav className={styles.chipBar}>
        <div className={styles.titleLine} />
        <div className={styles.chips}>
          <div className={styles.chip} />
          <div className={styles.chip} />
          <div className={styles.chip} />
          <div className={styles.chip} />
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.promoBanner}>
          <div className={styles.promoLine} />
          <div className={styles.promoLineShort} />
        </div>

        <section className={styles.section}>
          <div className={styles.catHeader}>
            <div className={styles.catLine} />
            <div className={styles.catDiamond} />
            <div className={styles.catLabel} />
            <div className={styles.catDiamond} />
            <div className={styles.catLine} />
          </div>

          {Array.from({ length: ITEM_ROWS }).map((_, i) => (
            <div key={i} className={styles.itemRow}>
              <div className={styles.itemLeft}>
                <div className={styles.itemName} />
                <div className={styles.itemDesc} />
              </div>
              <div className={styles.itemPrice} />
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
