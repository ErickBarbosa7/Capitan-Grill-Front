import { useNavigate } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import logo from '../assets/logo/logo.png'
import lugarVideo from '../assets/img/IMG_6038.MOV'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.landingContainer}>
      <video className={styles.backgroundVideo} autoPlay muted loop playsInline>
        <source src={lugarVideo} type="video/quicktime" />
        <source src={lugarVideo} type="video/mp4" />
      </video>

      <div className={styles.overlay} />

      <main className={styles.content}>
        <img src={logo} alt="Capitán Grill Logo" className={styles.logo} />

        <h1 className={styles.brandName}>Capitán Grill</h1>
        <p className={styles.slogan}>El Sabor del Norte</p>

        <button
          className={styles.ctaButton}
          onClick={() => navigate('/menu')}
        >
          <UtensilsCrossed size={20} />
          <span>Ver Menú Digital</span>
        </button>
      </main>
    </div>
  )
}
