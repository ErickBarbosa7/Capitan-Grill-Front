import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMenuContext } from '../contexts/MenuContext'
import Loading from '../components/Loading'
import CategoryDropdown from '../components/admin/CategoryDropdown'
import { Sparkles, Camera, ArrowLeft, Loader } from 'lucide-react'
import { generateDescription } from '../services/menuService'
import styles from './EditItemPage.module.css'

function generateCode(categories) {
  const used = new Set()
  for (const cat of categories) {
    for (const item of cat.items) {
      used.add(item.id)
    }
  }
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

  const isNew = !code

  const activeCategories = useMemo(() => categories.filter(c => c.isActive), [categories])

  const item = useMemo(() => {
    if (isNew) return null
    for (const cat of categories) {
      const found = cat.items.find((i) => i.id === code)
      if (found) return { ...found, categoriaId: cat.id }
    }
    return null
  }, [categories, code, isNew])

  const newCode = useMemo(() => {
    if (!isNew) return ''
    return generateCode(categories)
  }, [categories, isNew])

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
    if (field === 'nombre') {
      if (!value.trim()) return 'El nombre es obligatorio'
      if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
    }
    if (field === 'nombreEn') {
      if (!value.trim()) return 'Name is required'
      if (value.trim().length < 2) return 'Name must be at least 2 characters'
    }
    if (field === 'precio') {
      const num = Number(value)
      if (isNaN(num) || num <= 0) return 'El precio debe ser mayor a 0'
    }
    if (field === 'categoriaId') {
      if (!value) return 'Selecciona una categoría'
    }
    return ''
  }

  const handleBlur = (field) => {
    const currentValue = field === 'nombre' ? nombreEs : field === 'nombreEn' ? nombreEn : field === 'precio' ? precio : categoriaId
    const err = validate(field, currentValue)
    setErrors(prev => ({ ...prev, [field]: err }))
  }

  const firstCatId = useMemo(() => activeCategories[0]?.id || '', [activeCategories])

  useEffect(() => {
    if (isNew) {
      setNombreEs('')
      setNombreEn('')
      setDescripcionEs('')
      setDescripcionEn('')
      setCategoriaId(firstCatId)
      setPrecio(0)
      setDisponible(true)
      setImageUrl('')
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
    reader.onload = () => {
      setImageUrl(reader.result)
      setUploading(false)
    }
    reader.onerror = () => {
      toast.error('Error al leer la imagen')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const hasErrors = useMemo(() => {
    const eNombre = validate('nombre', nombreEs)
    const ePrecio = validate('precio', precio)
    const eCat = validate('categoriaId', categoriaId)
    return !!(eNombre || ePrecio || eCat)
  }, [nombreEs, precio, categoriaId])

  const handleAiImprove = async () => {
    if (!nombreEs.trim()) {
      return toast.warn('Escribe al menos el nombre en español')
    }
    setAiLoading(true)
    try {
      const cat = categories.find(c => c.id === categoriaId)
      const res = await generateDescription({
        nombreEs,
        nombreEn,
        descripcionEs,
        categoriaNombreEs: cat?.nombre || '',
        categoriaNombreEn: cat?.nombreEn || '',
      })
      if (res.nombreEn) setNombreEn(res.nombreEn)
      if (res.descripcionEs) setDescripcionEs(res.descripcionEs)
      if (res.descripcionEn) setDescripcionEn(res.descripcionEn)
      toast.success('Contenido generado con IA')
    } catch (err) {
      toast.error(err.message || 'Error al generar con IA')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const eNombre = validate('nombre', nombreEs)
    const ePrecio = validate('precio', precio)
    const eCat = validate('categoriaId', categoriaId)
    setErrors({ nombre: eNombre, precio: ePrecio, categoriaId: eCat })
    if (eNombre || ePrecio || eCat) return
    setSaving(true)
    const images = imageUrl ? [{ url: imageUrl, isPrimary: true }] : []
    try {
      if (isNew) {
        await createItem({
          id: newCode,
          nombreEs: nombreEs.trim(),
          nombreEn: nombreEn.trim() || nombreEs.trim(),
          descripcionEs: descripcionEs.trim(),
          descripcionEn: descripcionEn.trim() || descripcionEs.trim(),
          precio: Number(precio),
          disponible,
          categoriaId,
          images,
        })
        toast.success('Producto creado')
      } else {
        await updateItem(code, {
          id: code,
          nombreEs: nombreEs.trim(),
          nombreEn: nombreEn.trim() || nombreEs.trim(),
          descripcionEs: descripcionEs.trim(),
          descripcionEn: descripcionEn.trim() || descripcionEs.trim(),
          precio: Number(precio),
          disponible,
          categoriaId,
          images,
        })
        toast.success('Producto actualizado')
      }
      navigate('/admin/menu')
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

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
        <ArrowLeft size={20} /> Mi Menú
      </button>

      <h1 className={styles.heading}>
        <span className={styles.headingSerif}>
          {isNew ? 'Agregar producto' : 'Editar Producto'}
        </span>
        <span className={styles.headingCode}>{isNew ? newCode : code}</span>
      </h1>

      <form className={styles.layout} onSubmit={handleSubmit}>
        <div className={styles.formCol}>
          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Nombre (Español)</span>
              <input
                className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                value={nombreEs}
                onChange={(e) => { setNombreEs(e.target.value); setErrors(prev => ({ ...prev, nombre: '' })) }}
                onBlur={() => handleBlur('nombre')}
                placeholder="Ej: Rib Eye"
                autoFocus
              />
              {errors.nombre && <span className={styles.fieldError}>{errors.nombre}</span>}
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Name (English)</span>
              <input
                className={`${styles.input} ${errors.nombreEn ? styles.inputError : ''}`}
                value={nombreEn}
                onChange={(e) => { setNombreEn(e.target.value); setErrors(prev => ({ ...prev, nombreEn: '' })) }}
                onBlur={() => handleBlur('nombreEn')}
                placeholder="E.g.: Rib Eye"
              />
              {errors.nombreEn && <span className={styles.fieldError}>{errors.nombreEn}</span>}
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Descripción (Español)</span>
            <textarea
              className={styles.textarea}
              value={descripcionEs}
              onChange={(e) => setDescripcionEs(e.target.value)}
              placeholder="Describe el producto"
              rows={4}
            />
          </label>

          <button type="button" className={styles.aiButtonInline} onClick={handleAiImprove} disabled={aiLoading}>
            {aiLoading ? <Loader size={16} className={styles.spin} /> : <Sparkles size={16} />}
            {aiLoading ? 'Generando…' : 'Generar con IA'}
            <span className={styles.aiBadge}>Crea o mejora nombre y descripciones</span>
          </button>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Description (English)</span>
            <textarea
              className={styles.textarea}
              value={descripcionEn}
              onChange={(e) => setDescripcionEn(e.target.value)}
              placeholder="Describe the dish…"
              rows={4}
            />
          </label>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Categoría</span>
              <CategoryDropdown
                categories={activeCategories}
                value={categoriaId}
                onChange={(v) => { setCategoriaId(v); setErrors(prev => ({ ...prev, categoriaId: '' })) }}
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
                type="number"
                min="0.01"
                step="0.01"
                value={precio || ''}
                onChange={(e) => { setPrecio(e.target.value === '' ? 0 : Number(e.target.value)); setErrors(prev => ({ ...prev, precio: '' })) }}
                onBlur={() => handleBlur('precio')}
                placeholder="0.00"
              />
              {errors.precio && <span className={styles.fieldError}>{errors.precio}</span>}
            </label>
          </div>

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

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/admin/menu')}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving || hasErrors}>
              {saving ? 'Guardando…' : (isNew ? 'Crear producto' : 'Guardar cambios')}
            </button>
          </div>
        </div>

        <div className={styles.previewCol}>
          <div className={styles.imageCard}>
            {imageUrl ? (
              <img src={imageUrl} alt="Vista previa" className={styles.imagePreview} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <Camera size={32} />
                <span className={styles.imageHint}>Foto del producto</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className={styles.imageBtn}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader size={16} className={styles.spin} /> : <Camera size={16} />}
              {uploading ? 'Subiendo…' : imageUrl ? 'Cambiar foto' : 'Agregar foto'}
            </button>
            {imageUrl && (
              <button
                type="button"
                className={styles.imageRemoveBtn}
                onClick={() => setImageUrl('')}
              >
                Eliminar foto
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
