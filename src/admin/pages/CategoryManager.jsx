import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMenuContext } from '../../contexts/MenuContext'
import Loading from '../../components/Loading'
import { Plus, Pencil, Trash2, RotateCcw, Check, X, ArrowLeft } from 'lucide-react'
import styles from './CategoryManager.module.css'

export default function CategoryManager() {
  const navigate = useNavigate()
  const { categories, loading, createCategory, updateCategory, deleteCategory, hardDeleteCategory, restoreCategory } = useMenuContext()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [nameError, setNameError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim() || newName.trim().length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres')
      return
    }
    setSaving(true)
    try {
      await createCategory({ nameEs: newName.trim(), nameEn: newName.trim() })
      setNewName('')
      toast.success('Categoría creada')
    } catch (err) {
      toast.error(err.message || 'Error al crear')
    } finally {
      setSaving(false)
    }
  }

  const handleRename = async (slug) => {
    if (!editName.trim()) return
    try {
      await updateCategory(slug, { nameEs: editName.trim(), nameEn: editName.trim() })
      setEditingId(null)
      setEditName('')
      toast.success('Categoría actualizada')
    } catch (err) {
      toast.error(err.message || 'Error al actualizar')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteCategory(deleting.slug)
      toast.success(`Categoría "${deleting.nombre}" eliminada`)
      setDeleting(null)
    } catch (err) {
      toast.error(err.message || 'Error al eliminar')
    }
  }

  const handleRestore = async (slug) => {
    try {
      await restoreCategory(slug)
      toast.success('Categoría restaurada')
    } catch (err) {
      toast.error(err.message || 'Error al restaurar')
    }
  }

  const handleHardDelete = async () => {
    if (!deleting) return
    try {
      await hardDeleteCategory(deleting.slug)
      toast.success('Categoría eliminada permanentemente')
      setDeleting(null)
    } catch (err) {
      toast.error(err.message || 'Error al eliminar')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    if (deleting.hard) {
      await handleHardDelete()
    } else {
      await handleDelete()
    }
  }

  if (loading) return <Loading />

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/admin')}>
        <ArrowLeft size={20} /> Dashboard
      </button>

      <h1 className={styles.headingSerif}>Categorías</h1>

      <form className={styles.createForm} onSubmit={handleCreate}>
        <div className={styles.createField}>
          <input
            className={`${styles.createInput} ${nameError ? styles.inputError : ''}`}
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setNameError('') }}
            onBlur={() => { if (newName.trim() && newName.trim().length < 2) setNameError('El nombre debe tener al menos 2 caracteres') }}
            placeholder="Nombre de la nueva categoría"
          />
          {nameError && <span className={styles.fieldError}>{nameError}</span>}
        </div>
        <button type="submit" className={styles.createBtn} disabled={saving || !newName.trim()}>
          <Plus size={16} />
          Agregar
        </button>
      </form>

      {categories.length === 0 ? (
        <p className={styles.empty}>No hay categorías aún. Crea la primera.</p>
      ) : (
      <div className={styles.list}>
        {categories.map((cat) => (
          <div key={cat.id} className={`${styles.row} ${!cat.isActive ? styles.rowDeleted : ''}`}>
            {editingId === cat.id ? (
              <div className={styles.editRow}>
                <input
                  className={styles.editInput}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleRename(cat.id) }
                    if (e.key === 'Escape') { setEditingId(null); setEditName('') }
                  }}
                  autoFocus
                />
                <button className={styles.iconBtn} onClick={() => handleRename(cat.id)}>
                  <Check size={14} />
                </button>
                <button className={styles.iconBtn} onClick={() => { setEditingId(null); setEditName('') }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className={styles.rowInfo}>
                  <span className={`${styles.rowName} ${!cat.isActive ? styles.nameDeleted : ''}`}>
                    {cat.nombre}
                  </span>
                  <span className={styles.rowSlug}>{cat.id}</span>
                </div>
                <div className={styles.rowActions}>
                  {cat.isActive ? (
                    <>
                      <button
                        className={styles.actionBtn}
                        onClick={() => { setEditingId(cat.id); setEditName(cat.nombre) }}
                        title="Renombrar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.actionDanger}`}
                        onClick={() => setDeleting({ slug: cat.id, nombre: cat.nombre, hard: false })}
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={`${styles.actionBtn} ${styles.actionRestore}`}
                        onClick={() => handleRestore(cat.id)}
                        title="Restaurar"
                      >
                        <RotateCcw size={15} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.actionDanger}`}
                        onClick={() => setDeleting({ slug: cat.id, nombre: cat.nombre, hard: true })}
                        title="Eliminar permanentemente"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      )}

      {deleting && (
        <div className={styles.overlay} onClick={() => setDeleting(null)}>
          <div className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <p className={`${styles.confirmText} ${deleting.hard ? styles.confirmDanger : ''}`}>
              {deleting.hard ? (
                <>¿Eliminar permanentemente <strong>{deleting.nombre}</strong>? Esta acción no se puede deshacer.</>
              ) : (
                <>¿Eliminar <strong>{deleting.nombre}</strong>? Los platillos en esta categoría quedarán sin categoría.</>
              )}
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleting(null)}>
                Cancelar
              </button>
              <button className={deleting.hard ? styles.hardDeleteBtn : styles.deleteBtn} onClick={handleConfirmDelete}>
                {deleting.hard ? 'Eliminar permanentemente' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
