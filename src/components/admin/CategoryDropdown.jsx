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
  const [newNameEs, setNewNameEs] = useState('')
  const [newNameEn, setNewNameEn] = useState('')
  const [newLang, setNewLang] = useState('es')
  const [editingId, setEditingId] = useState(null)
  const [editNameEs, setEditNameEs] = useState('')
  const [editNameEn, setEditNameEn] = useState('')
  const [editLang, setEditLang] = useState('es')
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
    if (!newNameEs.trim()) return
    try {
      await onCreate({ nameEs: newNameEs.trim(), nameEn: newNameEn.trim() || newNameEs.trim() })
      setNewNameEs('')
      setNewNameEn('')
      setAdding(false)
    } catch {}
  }

  const handleRename = async (slug) => {
    if (!editNameEs.trim()) return
    const cat = categories.find((c) => c.id === slug)
    if (!cat) return
    try {
      await onUpdate(cat.id, { nameEs: editNameEs.trim(), nameEn: editNameEn.trim() || editNameEs.trim() })
      setEditingId(null)
      setEditNameEs('')
      setEditNameEn('')
    } catch {}
  }

  const handleDelete = async (slug) => {
    const cat = categories.find((c) => c.id === slug)
    if (!cat) return
    try {
      await onDelete(cat.id)
    } catch {}
  }

  const startEditing = (cat) => {
    setEditingId(cat.id)
    setEditNameEs(cat.nombreEs || cat.nombre)
    setEditNameEn(cat.nombreEn || cat.nombre)
    setEditLang('es')
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
                  <div className={styles.langTabs}>
                    <button
                      type="button"
                      className={`${styles.langTab} ${editLang === 'es' ? styles.langTabActive : ''}`}
                      onClick={() => setEditLang('es')}
                    >
                      ES
                    </button>
                    <button
                      type="button"
                      className={`${styles.langTab} ${editLang === 'en' ? styles.langTabActive : ''}`}
                      onClick={() => setEditLang('en')}
                    >
                      EN
                    </button>
                  </div>
                  <input
                    className={styles.editInput}
                    value={editLang === 'es' ? editNameEs : editNameEn}
                    onChange={(e) => {
                      if (editLang === 'es') setEditNameEs(e.target.value)
                      else setEditNameEn(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); handleRename(cat.id) }
                      if (e.key === 'Escape') { setEditingId(null); setEditNameEs(''); setEditNameEn('') }
                    }}
                    autoFocus
                  />
                  <button className={styles.iconBtn} onClick={() => handleRename(cat.id)}>
                    <Check size={14} />
                  </button>
                  <button className={styles.iconBtn} onClick={() => { setEditingId(null); setEditNameEs(''); setEditNameEn('') }}>
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
                        onClick={() => startEditing(cat)}
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
              <div className={styles.langTabs}>
                <button
                  type="button"
                  className={`${styles.langTab} ${newLang === 'es' ? styles.langTabActive : ''}`}
                  onClick={() => setNewLang('es')}
                >
                  ES
                </button>
                <button
                  type="button"
                  className={`${styles.langTab} ${newLang === 'en' ? styles.langTabActive : ''}`}
                  onClick={() => setNewLang('en')}
                >
                  EN
                </button>
              </div>
              <input
                className={styles.editInput}
                value={newLang === 'es' ? newNameEs : newNameEn}
                onChange={(e) => {
                  if (newLang === 'es') setNewNameEs(e.target.value)
                  else setNewNameEn(e.target.value)
                }}
                placeholder={newLang === 'es' ? 'Nombre (Español)' : 'Name (English)'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
                  if (e.key === 'Escape') { setAdding(false); setNewNameEs(''); setNewNameEn('') }
                }}
                autoFocus
              />
              <button className={styles.iconBtn} onClick={handleAdd}>
                <Check size={14} />
              </button>
              <button className={styles.iconBtn} onClick={() => { setAdding(false); setNewNameEs(''); setNewNameEn('') }}>
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
