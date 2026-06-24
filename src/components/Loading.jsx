import styles from './Loading.module.css'

export default function Loading({ size = 80, fullPage = true }) {
  const spinner = (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
    >
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  )

  if (!fullPage) return spinner

  return (
    <div className={styles.wrapper}>
      {spinner}
    </div>
  )
}
