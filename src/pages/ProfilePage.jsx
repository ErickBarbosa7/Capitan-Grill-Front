import { useState } from 'react'
import { Mail, Shield, Pencil, Check, X, LogOut, ExternalLink } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from '../services/authService'
import styles from './ProfilePage.module.css'

const roleLabels  = { admin: 'Administrador', editor: 'Editor' }
const roleColors  = { admin: styles.roleAdmin, editor: styles.roleEditor }

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(user?.name || '')
  const [saving, setSaving]   = useState(false)

  if (!user) return (
    <div className={styles.page}>
      <p className={styles.error}>No se encontró información del usuario.</p>
    </div>
  )

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? 'A'

  const handleSave = async () => {
    if (!name.trim()) { toast.error('El nombre no puede estar vacío'); return }
    setSaving(true)
    try {
      const updated = await updateProfile(user.email, name.trim())
      setUser(updated)
      toast.success('Nombre actualizado')
      setEditing(false)
    } catch (err) {
      toast.error(err.message || 'Error al actualizar')
    } finally { setSaving(false) }
  }

  const handleCancel = () => { setName(user.name || ''); setEditing(false) }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className={styles.page}>

      {/* ── ENCABEZADO ── */}
      <span className={styles.headingLabel}>Cuenta</span>
      <h1 className={styles.heading}>Mi Perfil</h1>

      {/* ── LAYOUT DOS COLUMNAS ── */}
      <div className={styles.layout}>

        {/* ── COLUMNA IZQUIERDA: identidad ── */}
        <div className={styles.identityPanel}>
          <div className={styles.panelBg} />
          <div className={styles.panelOverlay} />
          <div className={styles.panelContent}>

            {/* Avatar grande */}
            <div className={styles.avatar}>{initials}</div>

            {/* Nombre + rol */}
            <div className={styles.identity}>
              <span className={styles.identityName}>
                {user.name || 'Sin nombre'}
              </span>
              <span className={`${styles.identityRole} ${roleColors[user.role] || ''}`}>
                {roleLabels[user.role] || user.role}
              </span>
            </div>

            {/* Email resumido */}
            <span className={styles.identityEmail}>{user.email}</span>

            {/* Separador */}
            <div className={styles.panelDivider} />

            {/* Acciones panel */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.panelAction}
            >
              <ExternalLink size={13} />
              Ver menú público
            </a>
            <button className={styles.panelActionDanger} onClick={handleLogout}>
              <LogOut size={13} />
              Cerrar sesión
            </button>

          </div>
        </div>

        {/* ── COLUMNA DERECHA: campos ── */}
        <div className={styles.fieldsCol}>

          {/* Sección: Información personal */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Información personal</span>

            <div className={styles.fieldCard}>

              {/* Nombre — editable */}
              <div className={styles.field}>
                <div className={styles.fieldLeft}>
                  <span className={styles.fieldLabel}>Nombre </span>
                  {editing ? (
                    <div className={styles.editRow}>
                      <input
                        className={styles.editInput}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSave()
                          if (e.key === 'Escape') handleCancel()
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span className={styles.fieldValue}>
                      {user.name || <span className={styles.fieldEmpty}>Sin nombre</span>}
                    </span>
                  )}
                </div>
                <div className={styles.fieldActions}>
                  {editing ? (
                    <>
                      <button className={styles.actionSave} onClick={handleSave} disabled={saving} title="Guardar">
                        <Check size={13} />
                      </button>
                      <button className={styles.actionCancel} onClick={handleCancel} title="Cancelar">
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.actionEdit}
                      onClick={() => { setName(user.name || ''); setEditing(true) }}
                      title="Editar nombre"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.fieldDivider} />

              {/* Email — readonly */}
              <div className={styles.field}>
                <div className={styles.fieldLeft}>
                  <span className={styles.fieldLabel}>Correo electrónico</span>
                  <span className={styles.fieldValue}>{user.email}</span>
                </div>
                <Mail size={15} className={styles.fieldReadIcon} />
              </div>

            </div>
          </div>

          {/* Sección: Acceso */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Acceso y permisos</span>

            <div className={styles.fieldCard}>
              <div className={styles.field}>
                <div className={styles.fieldLeft}>
                  <span className={styles.fieldLabel}>Rol</span>
                  <span className={styles.fieldValue}>{roleLabels[user.role] || user.role}</span>
                </div>
                <span className={`${styles.rolePill} ${roleColors[user.role] || ''}`}>
                  <Shield size={11} />
                  {roleLabels[user.role] || user.role}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}