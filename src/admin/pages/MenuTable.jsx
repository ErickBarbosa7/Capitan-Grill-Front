import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMenuContext } from '../../contexts/MenuContext'
import { useMinimumLoading } from '../../hooks/useMinimumLoading'
import { Loader } from '../../components/Loader'
import CategoryDropdown from '../components/CategoryDropdown'
import { Pencil, Trash2, Plus, Search, Eye, EyeOff, RotateCcw, XCircle, LayoutGrid, Table2, Camera, X } from 'lucide-react'
import { optimizeImageUrl } from '../../utils/cloudinary'
import styles from './MenuTable.module.css'

export default function MenuTable() {
  const navigate = useNavigate()
  const { categories, loading, deleteItem, toggleAvailability, restoreItem, hardDeleteItem } = useMenuContext()
  const displayLoading = useMinimumLoading(loading)

  const [deleting, setDeleting] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [viewMode, setViewMode] = useState('table')

  const statusOptions = useMemo(() => [
    { id: 'todos', nombre: 'Todos' },
    { id: 'activos', nombre: 'Activos' },
    { id: 'ocultos', nombre: 'Ocultos' },
    { id: 'eliminados', nombre: 'Eliminados' },
  ], [])

  const hasFilters = search || filterCat || statusFilter !== 'todos'

  const clearFilters = () => {
    setSearch('')
    setFilterCat('')
    setStatusFilter('todos')
  }

  const activeCategories = useMemo(() => categories.filter(c => c.isActive), [categories])

  const catFilterOptions = useMemo(() => [
    { id: '', nombre: 'Todas las categorías' },
    ...activeCategories,
  ], [activeCategories])

  const allItems = useMemo(
    () =>
      categories.flatMap((cat) =>
        cat.items.map((item) => ({ ...item, categoriaId: cat.id, categoriaName: cat.nombre }))
      ),
    [categories]
  )

  const filteredItems = useMemo(() => {
    let items = allItems
    if (statusFilter === 'activos') {
      items = items.filter(i => i.isActive !== false && i.disponible === true)
    } else if (statusFilter === 'ocultos') {
      items = items.filter(i => i.isActive !== false && i.disponible === false)
    } else if (statusFilter === 'eliminados') {
      items = items.filter(i => i.isActive === false)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(i => i.nombre.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
    }
    if (filterCat) {
      items = items.filter(i => i.categoriaId === filterCat)
    }
    return items
  }, [allItems, search, filterCat, statusFilter])

  const handleDelete = useCallback(async () => {
    if (!deleting) return
    setSaving(true)
    try {
      await deleteItem(deleting.item.id)
      toast.success('Platillo eliminado')
      setDeleting(null)
    } catch (err) {
      toast.error(err.message || 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }, [deleting, deleteItem])

  const handleToggle = useCallback(
    async (code, current) => {
      try {
        await toggleAvailability(code)
        toast.success(current ? 'Platillo ocultado' : 'Platillo visible')
      } catch (err) {
        toast.error(err.message || 'Error al cambiar estado')
      }
    },
    [toggleAvailability]
  )

  const handleRestoreItem = useCallback(async (code) => {
    try {
      await restoreItem(code)
      toast.success('Platillo restaurado')
    } catch (err) {
      toast.error(err.message || 'Error al restaurar')
    }
  }, [restoreItem])

  const handleHardDelete = useCallback(async () => {
    if (!deleting) return
    setSaving(true)
    try {
      await hardDeleteItem(deleting.item.id)
      toast.success('Platillo eliminado permanentemente')
      setDeleting(null)
    } catch (err) {
      toast.error(err.message || 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }, [deleting, hardDeleteItem])

  if (displayLoading) return <Loader fullScreen={true} size={150} />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headingLabel}>Mi Menú</span>
          <h1 className={styles.heading}>{filteredItems.length} platillos en la mesa</h1>
        </div>
        <button className={styles.addBtn} onClick={() => navigate('/admin/menu/nuevo')}>
          <Plus size={18} />
          Agregar producto
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por nombre o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.catFilterWrap}>
          <CategoryDropdown
            categories={catFilterOptions}
            value={filterCat}
            onChange={setFilterCat}
            readOnly
          />
        </div>
        <div className={styles.statusFilterWrap}>
          <CategoryDropdown
            categories={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            readOnly
          />
        </div>
        {hasFilters && (
          <button className={styles.clearBtn} onClick={clearFilters} title="Limpiar filtros">
            <XCircle size={18} />
          </button>
        )}
      </div>

      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.toggleBtnActive : ''}`}
          onClick={() => setViewMode('table')}
          title="Vista tabla"
        >
          <Table2 size={18} />
        </button>
        <button
          className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleBtnActive : ''}`}
          onClick={() => setViewMode('grid')}
          title="Vista grid"
        >
          <LayoutGrid size={18} />
        </button>
      </div>

      {viewMode === 'table' ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: 56 }}>FOTO</th>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>NOMBRE</th>
                <th className={styles.th}>CATEGORÍA</th>
                <th className={styles.th}>PRECIO</th>
                <th className={styles.th}>DISPONIBLE</th>
                <th className={styles.th} style={{ width: 140 }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isDeleted = item.isActive === false
                const rowClass = isDeleted
                  ? `${styles.tr} ${styles.trDeleted}`
                  : item.disponible
                    ? styles.tr
                    : `${styles.tr} ${styles.trDisabled}`
                const thumb = item.images?.[0]?.url
                return (
                  <tr key={item.id} className={rowClass} onClick={() => setDetailItem(item)} style={{ cursor: 'pointer' }}>
                    <td className={styles.td}>
                      {thumb ? (
                        <img src={optimizeImageUrl(thumb)} alt="" className={styles.thumb} />
                      ) : (
                        <div className={styles.thumbPlaceholder}>
                          <Camera size={14} />
                        </div>
                      )}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.cellId}>{item.id}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.itemName} ${isDeleted ? styles.nameDeleted : ''}`}>
                        {item.nombre}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.categoryBadge}>{item.categoriaName}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.price}>${item.precio} MXN</span>
                    </td>
                    <td className={styles.td}>
                      {isDeleted ? (
                        <span className={`${styles.statusPill} ${styles.statusDeleted}`}>
                          ELIMINADO
                        </span>
                      ) : (
                        <span className={`${styles.statusPill} ${item.disponible ? styles.statusVisible : styles.statusHidden}`}>
                          <span className={styles.statusDot}>●</span>
                          {item.disponible ? 'VISIBLE' : 'OCULTO'}
                        </span>
                      )}
                    </td>
                    <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.actions}>
                        {isDeleted ? (
                          <>
                            <button
                              className={`${styles.actionBtn} ${styles.restoreActionBtn}`}
                              onClick={() => handleRestoreItem(item.id)}
                              title="Restaurar"
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                              onClick={() => setDeleting({ item, hard: true })}
                              title="Eliminar permanentemente"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleToggle(item.id, item.disponible)}
                              title={item.disponible ? 'Ocultar' : 'Mostrar'}
                            >
                              {item.disponible ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              className={styles.actionBtn}
                              onClick={() => navigate(`/admin/menu/editar/${item.id}`)}
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                              onClick={() => setDeleting({ item, catId: item.categoriaId })}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && <p className={styles.empty}>No hay platillos</p>}
        </div>
      ) : (
        <div className={styles.gridWrap}>
          {filteredItems.map((item) => {
            const isDeleted = item.isActive === false
            const cardClass = isDeleted
              ? `${styles.card} ${styles.cardDeleted}`
              : item.disponible
                ? styles.card
                : `${styles.card} ${styles.cardDisabled}`
            const thumb = item.images?.[0]?.url
            return (
              <div key={item.id} className={cardClass} onClick={() => setDetailItem(item)} style={{ cursor: 'pointer' }}>
                {thumb ? (
                  <img src={optimizeImageUrl(thumb)} alt="" className={styles.cardImage} />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <Camera size={28} />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <span className={`${styles.cardName} ${isDeleted ? styles.cardNameDeleted : ''}`}>
                    {item.nombre}
                  </span>
                  <div className={styles.cardMeta}>
                    <span className={styles.categoryBadge}>{item.categoriaName}</span>
                    <span className={styles.cardPrice}>${item.precio}</span>
                  </div>
                  {isDeleted ? (
                    <span className={`${styles.statusPill} ${styles.statusDeleted} ${styles.cardStatus}`}>
                      ELIMINADO
                    </span>
                  ) : (
                    <span className={`${styles.statusPill} ${item.disponible ? styles.statusVisible : styles.statusHidden} ${styles.cardStatus}`}>
                      <span className={styles.statusDot}>●</span>
                      {item.disponible ? 'VISIBLE' : 'OCULTO'}
                    </span>
                  )}
                  <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                    {isDeleted ? (
                      <>
                        <button
                          className={`${styles.actionBtn} ${styles.restoreActionBtn}`}
                          onClick={() => handleRestoreItem(item.id)}
                          title="Restaurar"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => setDeleting({ item, hard: true })}
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleToggle(item.id, item.disponible)}
                          title={item.disponible ? 'Ocultar' : 'Mostrar'}
                        >
                          {item.disponible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => navigate(`/admin/menu/editar/${item.id}`)}
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => setDeleting({ item, catId: item.categoriaId })}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {filteredItems.length === 0 && <p className={styles.empty}>No hay platillos</p>}
        </div>
      )}

      {deleting && (
        <div className={styles.overlay} onClick={() => setDeleting(null)}>
          <div className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <p className={`${styles.confirmText} ${deleting.hard ? styles.confirmDanger : ''}`}>
              {deleting.hard
                ? <>¿Eliminar permanentemente <strong>{deleting.item.nombre}</strong>? Esta acción no se puede deshacer.</>
                : <>¿Eliminar <strong>{deleting.item.nombre}</strong>?</>
              }
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleting(null)} disabled={saving}>
                Cancelar
              </button>
              <button
                className={deleting.hard ? styles.hardDeleteBtn : styles.deleteBtn}
                onClick={deleting.hard ? handleHardDelete : handleDelete}
                disabled={saving}
              >
                {saving ? 'Eliminando...' : (deleting.hard ? 'Eliminar permanentemente' : 'Eliminar')}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailItem && (
        <div className={styles.overlay} onClick={() => setDetailItem(null)}>
          <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.detailClose} onClick={() => setDetailItem(null)}>
              <X size={20} />
            </button>

            <div className={styles.detailImageWrap}>
              {detailItem.images?.[0]?.url ? (
                <img src={optimizeImageUrl(detailItem.images[0].url)} alt="" className={styles.detailImage} />
              ) : (
                <div className={styles.detailImagePlaceholder}>
                  <Camera size={36} />
                </div>
              )}
            </div>

            <div className={styles.detailBody}>
              <div className={styles.detailTop}>
                <span className={styles.cellId}>{detailItem.id}</span>
                {detailItem.isActive === false ? (
                  <span className={`${styles.statusPill} ${styles.statusDeleted}`}>ELIMINADO</span>
                ) : (
                  <span className={`${styles.statusPill} ${detailItem.disponible ? styles.statusVisible : styles.statusHidden}`}>
                    <span className={styles.statusDot}>●</span>
                    {detailItem.disponible ? 'VISIBLE' : 'OCULTO'}
                  </span>
                )}
              </div>

              <h2 className={styles.detailName}>{detailItem.nombre}</h2>

              {detailItem.descripcion && (
                <p className={styles.detailDesc}>{detailItem.descripcion}</p>
              )}

              <div className={styles.detailMeta}>
                <span className={styles.categoryBadge}>{detailItem.categoriaName}</span>
                <span className={styles.detailPrice}>${detailItem.precio} MXN</span>
              </div>

              <div className={styles.detailActions}>
                <button
                  className={styles.addBtn}
                  onClick={() => {
                    setDetailItem(null)
                    navigate(`/admin/menu/editar/${detailItem.id}`)
                  }}
                >
                  <Pencil size={16} />
                  Editar producto
                </button>
                <button className={styles.cancelBtn} onClick={() => setDetailItem(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
