import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import styles from './LoginPage.module.css'

import LottiePackage from 'lottie-react'
import welcomeAnim from '../../assets/lottie/welcome.json'
// Importa aquí tu animación grande para el lado izquierdo
import leftLargeAnim from '../../assets/lottie/people.json' 
import rightLargeAnim from '../../assets/lottie/people2.json'


const Lottie = LottiePackage.default || LottiePackage;

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className={styles.page}>
      {/* Cabecera estilo la imagen */}
      <header className={styles.header}>
        <div className={styles.brand}>Capitán Grill</div>
        <div className={styles.headerActions}>
          <a href="/" className={styles.link}>Ir al sitio web &rarr;</a>
        </div>
      </header>

      {/* Contenedor principal */}
      <main className={styles.mainArea}>
        
        {/* Animación grande a la izquierda */}
        <div className={styles.leftDecoration}>
          <Lottie 
            animationData={leftLargeAnim} 
            loop={true} 
            autoplay={true} 
            style={{ width: '100%', height: '100%' }} 
          />
        </div>

        {/* Tarjeta central */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconSlot}>
              <Lottie 
                animationData={welcomeAnim} 
                loop={true} 
                autoplay={true} 
                style={{ width: '100px', height: '100px' }} 
              />
            </div>
            <h1 className={styles.title}>Iniciar Sesión</h1>
            <p className={styles.subtitle}>
              Inicia sesión para acceder al<br />
              panel de administración.
            </p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu Email"
                autoFocus
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.passwordInput}`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(s => !s)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Show' : 'Hide'}
                </button>
              </div>
            </div>

            <div className={styles.helpText}>
            </div>

            <button className={styles.primaryBtn} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Decoración a la derecha (opcional, para equilibrar como en la imagen) */}
        <div className={styles.rightDecoration}>
          <Lottie 
            animationData={rightLargeAnim} 
            loop={true} 
            autoplay={true} 
            style={{ width: '100%', height: '100%' }} 
          />
        </div>

      </main>

      <footer className={styles.footer}>
        Copyright @CapitanGrill {new Date().getFullYear()} | Privacy Policy
      </footer>
    </div>
  )
}