import styles from './ExperienceCard.module.css'

export default function ExperienceCard({ number, title, description, detail }) {
  return (
    <div className={styles.card}>
      <span className={styles.number}>{number}</span>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
        {detail && <p className={styles.detail}>{detail}</p>}
      </div>
    </div>
  )
}
