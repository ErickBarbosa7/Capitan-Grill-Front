import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (isAdmin) {
    navigate('/admin', { replace: true })
    return null
  }

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
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <div className={styles.logo}>CG</div>
          <h1 className={styles.title}>Capitán Grill</h1>
          <p className={styles.subtitle}>Panel de administración</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </label>

        <label className={styles.label}>
          Contraseña
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
