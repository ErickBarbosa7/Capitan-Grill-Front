import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMenuContext } from '../../contexts/MenuContext'
import { useMinimumLoading } from '../../hooks/useMinimumLoading'
import { Loader as LoadingSpinner } from '../../components/Loader'
import CategoryDropdown from '../components/CategoryDropdown'
import { Sparkles, Camera, ArrowLeft, Loader } from 'lucide-react'
import { generateDescription } from '../../services/menuService'
import styles from './EditItemPage.module.css'

function generateCode(categories) {
  const used = new Set()
  for (const cat of categories) for (const item of cat.items) used.add(item.id)
  for (let n = 1; n < 999; n++) {
    const c = `n${String(n).padStart(2, '0')}`
    if (!used.has(c)) return c
  }
  return ''
}

export default function EditItemPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { categories, loading, createItem, updateItem, createCategory, updateCategory, deleteCategory } = useMenuContext()
  const displayLoading = useMinimumLoading(loading)

  const isNew = !code
  const activeCategories = useMemo(() => categories.filter(c => c.isActive), [categories])

  const item = useMemo(() => {
    if (isNew) return null
    for (const cat of categories) {
      const found = cat.items.find(i => i.id === code)
      if (found) return { ...found, categoriaId: cat.id }
    }
    return null
  }, [categories, code, isNew])

  const newCode = useMemo(() => isNew ? generateCode(categories) : '', [categories, isNew])
  const firstCatId = useMemo(() => activeCategories[0]?.id || '', [activeCategories])

  const [nombreEs, setNombreEs] = useState('')
  const [nombreEn, setNombreEn] = useState('')
  const [descripcionEs, setDescripcionEs] = useState('')
  const [descripcionEn, setDescripcionEn] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [precio, setPrecio] = useState(0)
  const [disponible, setDisponible] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [errors, setErrors] = useState({})
  const [aiLoading, setAiLoading] = useState(false)
  const fileRef = useRef(null)

  const validate = (field, value) => {
    if (field === 'nombre' && !value.trim()) return 'Obligatorio'
    if (field === 'precio' && (isNaN(Number(value)) || Number(value) <= 0)) return 'Mayor a 0'
    if (field === 'categoriaId' && !value) return 'Selecciona categoría'
    return ''
  }

  const handleBlur = (field) => {
    const v = field === 'nombre' ? nombreEs : field === 'precio' ? precio : categoriaId
    setErrors(prev => ({ ...prev, [field]: validate(field, v) }))
  }

  useEffect(() => {
    if (isNew) {
      setNombreEs(''); setNombreEn(''); setDescripcionEs(''); setDescripcionEn('')
      setCategoriaId(firstCatId); setPrecio(0); setDisponible(true); setImageUrl('')
    } else if (item) {
      setNombreEs(item.nombreEs || item.nombre)
      setNombreEn(item.nombreEn || item.nombre)
      setDescripcionEs(item.descripcionEs || '')
      setDescripcionEn(item.descripcionEn || '')
      setCategoriaId(item.categoriaId)
      setPrecio(item.precio)
      setDisponible(item.disponible)
      const primary = item.images?.find(i => i.isPrimary)
      setImageUrl(primary?.url || item.images?.[0]?.url || '')
    }
  }, [item, isNew, firstCatId])

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => { setImageUrl(reader.result); setUploading(false) }
    reader.onerror = () => { toast.error('Error al leer imagen'); setUploading(false) }
    reader.readAsDataURL(file)
  }

  const hasErrors = useMemo(() => {
    return !!(validate('nombre', nombreEs) || validate('precio', precio) || validate('categoriaId', categoriaId))
  }, [nombreEs, precio, categoriaId])

  const handleAiImprove = async () => {
    if (!nombreEs.trim()) return toast.warn('Escribe el nombre primero')
    setAiLoading(true)
    try {
      const cat = categories.find(c => c.id === categoriaId)
      const res = await generateDescription({ nombreEs, nombreEn, descripcionEs, categoriaNombreEs: cat?.nombre || '', categoriaNombreEn: cat?.nombreEn || '' })
      if (res.nombreEn) setNombreEn(res.nombreEn)
      if (res.descripcionEs) setDescripcionEs(res.descripcionEs)
      if (res.descripcionEn) setDescripcionEn(res.descripcionEn)
      toast.success('Generado con IA')
    } catch (err) {
      toast.error(err.message || 'Error con IA')
    } finally { setAiLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const eN = validate('nombre', nombreEs)
    const eP = validate('precio', precio)
    const eC = validate('categoriaId', categoriaId)
    setErrors({ nombre: eN, precio: eP, categoriaId: eC })
    if (eN || eP || eC) return
    setSaving(true)
    const images = imageUrl ? [{ url: imageUrl, isPrimary: true }] : []
    try {
      const payload = {
        nombreEs: nombreEs.trim(), nombreEn: nombreEn.trim() || nombreEs.trim(),
        descripcionEs: descripcionEs.trim(), descripcionEn: descripcionEn.trim() || descripcionEs.trim(),
        precio: Number(precio), disponible, categoriaId, images,
      }
      if (isNew) {
        await createItem({ id: newCode, ...payload })
        toast.success('Producto creado')
      } else {
        await updateItem(code, { id: code, ...payload })
        toast.success('Cambios guardados')
      }
      navigate('/admin/menu')
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  if (displayLoading) return <LoadingSpinner fullScreen={true} size={150} />

  if (!isNew && !item) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Producto no encontrado</p>
        <button className={styles.backBtn} onClick={() => navigate('/admin/menu')}>
          <ArrowLeft size={16} /> Volver al menú
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/admin/menu')}>
        <ArrowLeft size={14} /> Mi Menú
      </button>

      <div className={styles.pageHeader}>
        <div>
          <span className={styles.headingLabel}>{isNew ? 'Nuevo producto' : 'Editar producto'}</span>
          <span className={styles.headingSerif}>
            {isNew ? 'Agregar al menú' : (nombreEs || 'Editar producto')}
            <span className={styles.headingCode}>{isNew ? newCode : code}</span>
          </span>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/admin/menu')}>
            Cancelar
          </button>
          <button type="submit" form="edit-form" className={styles.saveBtn} disabled={saving || hasErrors}>
            {saving ? 'Guardando…' : (isNew ? 'Crear producto' : 'Guardar cambios')}
          </button>
        </div>
      </div>

      <form id="edit-form" className={styles.layout} onSubmit={handleSubmit}>
        <div className={styles.formCol}>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Nombre (ES)</span>
              <input
                className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                value={nombreEs}
                onChange={e => { setNombreEs(e.target.value); setErrors(p => ({ ...p, nombre: '' })) }}
                onBlur={() => handleBlur('nombre')}
                placeholder="Ej: Rib Eye a las brasas"
                autoFocus
              />
              {errors.nombre && <span className={styles.fieldError}>{errors.nombre}</span>}
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Name (EN)</span>
              <input
                className={styles.input}
                value={nombreEn}
                onChange={e => setNombreEn(e.target.value)}
                placeholder="E.g.: Grilled Rib Eye"
              />
            </label>
          </div>

          <div className={styles.sectionDivider}>Descripción</div>
          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Español</span>
              <textarea
                className={styles.textarea}
                value={descripcionEs}
                onChange={e => setDescripcionEs(e.target.value)}
                placeholder="Describe el platillo…"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>English</span>
              <textarea
                className={styles.textarea}
                value={descripcionEn}
                onChange={e => setDescripcionEn(e.target.value)}
                placeholder="Describe the dish…"
              />
            </label>
          </div>

          <button type="button" className={styles.aiButtonInline} onClick={handleAiImprove} disabled={aiLoading}>
            {aiLoading ? <Loader size={14} className={styles.spin} /> : <Sparkles size={14} />}
            {aiLoading ? 'Generando…' : 'Mejorar con IA'}
            <span className={styles.aiBadge}>Genera nombre y descripciones</span>
          </button>

          <div className={styles.sectionDivider}>Detalles</div>
          <div className={styles.fieldRow3}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Categoría</span>
              <CategoryDropdown
                categories={activeCategories}
                value={categoriaId}
                onChange={v => { setCategoriaId(v); setErrors(p => ({ ...p, categoriaId: '' })) }}
                onCreate={createCategory}
                onUpdate={updateCategory}
                onDelete={deleteCategory}
              />
              {errors.categoriaId && <span className={styles.fieldError}>{errors.categoriaId}</span>}
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Precio ($)</span>
              <input
                className={`${styles.input} ${errors.precio ? styles.inputError : ''}`}
                type="number" min="0.01" step="0.01"
                value={precio || ''}
                onChange={e => { setPrecio(e.target.value === '' ? 0 : Number(e.target.value)); setErrors(p => ({ ...p, precio: '' })) }}
                onBlur={() => handleBlur('precio')}
                placeholder="0.00"
              />
              {errors.precio && <span className={styles.fieldError}>{errors.precio}</span>}
            </label>
            <div className={styles.field} style={{ justifyContent: 'flex-end' }}>
              <span className={styles.fieldLabel}>Estado</span>
              <label className={styles.switchWrap}>
                <div
                  className={`${styles.switchTrack} ${disponible ? styles.switchOn : ''}`}
                  onClick={() => setDisponible(!disponible)}
                >
                  <div className={styles.switchKnob} />
                </div>
                <span className={`${styles.switchLabel} ${disponible ? styles.labelOn : styles.labelOff}`}>
                  {disponible ? 'Visible' : 'Oculto'}
                </span>
              </label>
            </div>
          </div>

        </div>

        <div className={styles.previewCol}>
          <div className={styles.imageCard}>
            {imageUrl
              ? <img src={imageUrl} alt="Vista previa" className={styles.imagePreview} />
              : (
                <div className={styles.imagePlaceholder}>
                  <Camera size={28} />
                  <span className={styles.imageHint}>Sin foto</span>
                </div>
              )
            }
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
            <div className={styles.imageBtnGroup}>
              <button type="button" className={styles.imageBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader size={14} className={styles.spin} /> : <Camera size={14} />}
                {uploading ? 'Subiendo…' : imageUrl ? 'Cambiar foto' : 'Agregar foto'}
              </button>
              {imageUrl && (
                <button type="button" className={styles.imageRemoveBtn} onClick={() => setImageUrl('')}>
                  Eliminar foto
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
