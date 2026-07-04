import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, X, Save, Users } from 'lucide-react'
import { getUsers, createUser, updateUser, removeUser } from '../../services/userService'
import { useAuth } from '../../contexts/AuthContext'
import styles from './UsersPage.module.css'

const roleLabels = { admin: 'Administrador', editor: 'Editor' }

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'editor' })
  const [saving, setSaving] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => {
    setEditingUser(null)
    setForm({ email: '', password: '', name: '', role: 'editor' })
    setShowModal(true)
  }

  const openEdit = (u) => {
    setEditingUser(u)
    setForm({ email: u.email, password: '', name: u.name || '', role: u.role })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || (!editingUser && !form.password)) {
      toast.error('Completa todos los campos requeridos')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form }
      if (editingUser && !payload.password) delete payload.password

      if (editingUser) {
        await updateUser(editingUser.id, payload)
        toast.success('Usuario actualizado')
      } else {
        await createUser(payload)
        toast.success('Usuario creado')
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    if (!deleteConfirm) return
    try {
      await removeUser(deleteConfirm.id)
      toast.success('Usuario desactivado')
      setDeleteConfirm(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.message || 'Error al desactivar')
    }
  }

  if (loading) return <div className={styles.page}><p className={styles.loading}>Cargando...</p></div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headingSerif}>Usuarios</h1>
          <p className={styles.subheading}>Gestión de cuentas del sistema</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>
          <Plus size={16} />
          Agregar usuario
        </button>
      </div>

      <div className={styles.tableWrap}>
        {users.length === 0 ? (
          <p className={styles.empty}>No hay usuarios registrados.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className={styles.colActions}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={!u.isActive ? styles.trDeleted : ''}>
                  <td>{u.name || '—'}</td>
                  <td>{u.email}</td>
                  <td><span className={styles.roleBadge}>{roleLabels[u.role] || u.role}</span></td>
                  <td>
                    {u.isActive ? (
                      <span className={styles.statusActive}>Activo</span>
                    ) : (
                      <span className={styles.statusInactive}>Inactivo</span>
                    )}
                  </td>
                  <td className={styles.cellActions}>
                    {u.isActive ? (
                      <>
                        <button className={styles.actionBtn} onClick={() => openEdit(u)} title="Editar">
                          <Pencil size={14} />
                        </button>
                        {currentUser?.email !== u.email && (
                          <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => setDeleteConfirm(u)} title="Desactivar">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </>
                    ) : (
                      <span className={styles.lockedBadge}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Users size={18} />
                {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
              </h2>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form className={styles.modalForm} onSubmit={handleSave}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nombre</label>
                <input className={styles.formInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Email *</label>
                  <input className={styles.formInput} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" required />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>{editingUser ? 'Nueva contraseña' : 'Contraseña'} *</label>
                  <input className={styles.formInput} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingUser ? 'Dejar vacío para mantener' : 'Contraseña'} required={!editingUser} />
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Rol</label>
                <select className={styles.formInput} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className={styles.submitBtn} disabled={saving}>
                  <Save size={16} />
                  {saving ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className={styles.overlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <p className={styles.confirmText}>
              ¿Desactivar a <strong>{deleteConfirm.name || deleteConfirm.email}</strong>? El usuario no podrá iniciar sesión.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className={styles.deleteBtn} onClick={handleRemove}>Desactivar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
