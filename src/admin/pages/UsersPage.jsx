import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, X, Save, Users, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { getUsers, createUser, updateUser, removeUser, restoreUser } from '../../services/userService'
import { useAuth } from '../../contexts/AuthContext'
import { useMinimumLoading } from '../../hooks/useMinimumLoading'
import { Loader } from '../../components/Loader'
import CategoryDropdown from '../components/CategoryDropdown'
import styles from './UsersPage.module.css'

const roleLabels = { admin: 'Administrador', editor: 'Editor' }

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const displayLoading = useMinimumLoading(loading)

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'editor' })
  const [showPassword, setShowPassword] = useState(false)
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
    const previous = users
    setSaving(true)
    try {
      const payload = { ...form }
      if (editingUser && !payload.password) delete payload.password

      if (editingUser) {
        const res = await updateUser(editingUser.id, payload)
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...res.user } : u))
        toast.success('Usuario actualizado')
      } else {
        const res = await createUser(payload)
        setUsers(prev => [...prev, res.user])
        toast.success('Usuario creado')
      }
      setShowModal(false)
    } catch (err) {
      setUsers(previous)
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    if (!deleteConfirm) return
    const previous = users
    setUsers(prev => prev.filter(u => u.id !== deleteConfirm.id))
    try {
      await removeUser(deleteConfirm.id)
      toast.success('Usuario desactivado')
      setDeleteConfirm(null)
    } catch (err) {
      setUsers(previous)
      toast.error(err.message || 'Error al desactivar')
    }
  }

  const handleRestore = async (id) => {
    const previous = users
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: true } : u))
    try {
      await restoreUser(id)
      toast.success('Usuario restaurado')
    } catch (err) {
      setUsers(previous)
      toast.error(err.message || 'Error al restaurar')
    }
  }

  if (displayLoading) return <Loader fullScreen={true} size={150} />

  if (!isAdmin) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.headingSerif}>Usuarios</h1>
            <p className={styles.subheading}>Gestión de cuentas del sistema</p>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <p className={styles.empty}>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    )
  }

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
                      <button className={`${styles.actionBtn} ${styles.actionRestore}`} onClick={() => handleRestore(u.id)} title="Restaurar">
                        <RotateCcw size={14} />
                      </button>
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
                  <div className={styles.passwordInputRow}>
                    <input className={styles.formInput} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingUser ? 'Dejar vacío para mantener' : 'Contraseña'} required={!editingUser} />
                    <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(s => !s)} tabIndex={-1}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Rol</label>
                <CategoryDropdown
                  categories={[
                    { id: 'editor', nombre: 'Editor' },
                    { id: 'admin', nombre: 'Administrador' },
                  ]}
                  value={form.role}
                  onChange={(val) => setForm({ ...form, role: val })}
                  readOnly
                  placeholder="Seleccionar rol"
                />
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
