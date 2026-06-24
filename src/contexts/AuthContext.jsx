import { createContext, useContext, useState, useCallback } from 'react'
import { loginUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('capitan_admin')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      const userData = await loginUser(email, password)
      localStorage.setItem('capitan_admin', JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('capitan_admin')
    setUser(null)
    setError(null)
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
