import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, Pencil, Trash2, Check, X, RotateCcw } from 'lucide-react'
import styles from './CategoryDropdown.module.css'

export default function CategoryDropdown({
  categories,
  value,
  onChange,
  onCreate,
  onUpdate,
  onDelete,
  onRestore,
  readOnly,
}) {
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = categories.find((c) => c.id === value)

  const handleAdd = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (!newName.trim()) return
    try {
      await onCreate({ nameEs: newName.trim(), nameEn: newName.trim() })
      setNewName('')
      setAdding(false)
    } catch {}
  }

  const handleRename = async (slug) => {
    if (!editName.trim()) return
    const cat = categories.find((c) => c.id === slug)
    if (!cat) return
    try {
      await onUpdate(cat.id, { nameEs: editName.trim(), nameEn: editName.trim() })
      setEditingId(null)
      setEditName('')
    } catch {}
  }

  const handleDelete = async (slug) => {
    const cat = categories.find((c) => c.id === slug)
    if (!cat) return
    try {
      await onDelete(cat.id)
    } catch {}
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.triggerLabel}>
          {selected ? selected.nombre : 'Seleccionar categoría'}
        </span>
        <ChevronDown size={16} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>

      {open && (
        <div className={styles.menu}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.item}>
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
                  <button
                    type="button"
                    className={`${styles.optionBtn} ${value === cat.id ? styles.optionActive : ''}`}
                    onClick={() => { onChange(cat.id); setOpen(false) }}
                  >
                    {cat.nombre}
                  </button>
                  {readOnly && !cat.isActive && onRestore ? (
                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconRestore}`}
                        onClick={(e) => { e.stopPropagation(); onRestore(cat.id) }}
                        title="Restaurar"
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>
                  ) : !readOnly && (
                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => { setEditingId(cat.id); setEditName(cat.nombre) }}
                        title="Renombrar"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconDanger}`}
                        onClick={() => handleDelete(cat.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {adding ? (
            <div className={styles.addRow}>
              <input
                className={styles.editInput}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre de la categoría"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
                  if (e.key === 'Escape') { setAdding(false); setNewName('') }
                }}
                autoFocus
              />
              <button className={styles.iconBtn} onClick={handleAdd}>
                <Check size={14} />
              </button>
              <button className={styles.iconBtn} onClick={() => { setAdding(false); setNewName('') }}>
                <X size={14} />
              </button>
            </div>
          ) : !readOnly && (
            <button type="button" className={styles.addBtn} onClick={() => setAdding(true)}>
              <Plus size={14} />
              <span>Agregar categoría</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
