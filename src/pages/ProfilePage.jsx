import { useState } from 'react'
import { User, Mail, Shield, Pencil, Check, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from '../services/authService'
import styles from './ProfilePage.module.css'

const roleLabels = { admin: 'Administrador', editor: 'Editor' }

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  if (!user) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>No se encontró información del usuario.</p>
      </div>
    )
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío')
      return
    }
    setSaving(true)
    try {
      const updated = await updateProfile(user.email, name.trim())
      setUser(updated)
      toast.success('Nombre actualizado')
      setEditing(false)
    } catch (err) {
      toast.error(err.message || 'Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setName(user.name || '')
    setEditing(false)
  }

  const startEditing = () => {
    setName(user.name || '')
    setEditing(true)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Mi Perfil</h1>
      <p className={styles.subheading}>Información de tu cuenta de administración</p>

      <div className={styles.card}>
        <div className={styles.avatar}>
          {(user.name || '?').charAt(0).toUpperCase()}
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <span className={styles.fieldIcon}><User size={16} /></span>
            <div className={styles.fieldContent}>
              <span className={styles.fieldLabel}>Nombre</span>
              {editing ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.editInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                  <button className={styles.saveBtn} onClick={handleSave} disabled={saving} title="Guardar">
                    <Check size={16} />
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel} title="Cancelar">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <span className={styles.fieldValue}>
                  {user.name || 'Sin nombre'}
                </span>
              )}
            </div>
            {!editing && (
              <button className={styles.editIconBtn} onClick={startEditing} title="Editar nombre">
                <Pencil size={14} />
              </button>
            )}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldIcon}><Mail size={16} /></span>
            <div className={styles.fieldContent}>
              <span className={styles.fieldLabel}>Correo electrónico</span>
              <span className={styles.fieldValue}>{user.email}</span>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldIcon}><Shield size={16} /></span>
            <div className={styles.fieldContent}>
              <span className={styles.fieldLabel}>Rol</span>
              <span className={styles.fieldValue}>{roleLabels[user.role] || user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
