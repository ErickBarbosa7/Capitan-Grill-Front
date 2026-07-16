import { useState, useMemo, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, X, Save, Calculator } from 'lucide-react'
import { useMinimumLoading } from '../../hooks/useMinimumLoading'
import { Loader } from '../../components/Loader'
import styles from './CashClosePage.module.css'

const todayStr = () => new Date().toISOString().split('T')[0]

const initialMocks = [
  { id: 1, fecha: '2026-07-04', efectivo: 4850, tarjeta: 3200, total: 8050, observaciones: '' },
  { id: 2, fecha: '2026-07-03', efectivo: 3720, tarjeta: 4100, total: 7820, observaciones: 'Poco movimiento' },
  { id: 3, fecha: '2026-07-02', efectivo: 5100, tarjeta: 2800, total: 7900, observaciones: '' },
]

export default function CashClosePage() {
  const [cortes, setCortes] = useState(initialMocks)
  const [loading] = useState(false)
  const displayLoading = useMinimumLoading(loading)

  const [filterKey, setFilterKey] = useState('hoy')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ fecha: todayStr(), efectivo: '', tarjeta: '', observaciones: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  const totalCalculado = useMemo(() => {
    const ef = parseFloat(form.efectivo) || 0
    const tj = parseFloat(form.tarjeta) || 0
    return ef + tj
  }, [form.efectivo, form.tarjeta])

  const openCreate = () => {
    setEditing(null)
    setForm({ fecha: todayStr(), efectivo: '', tarjeta: '', observaciones: '' })
    setShowModal(true)
  }

  const openEdit = (corte) => {
    setEditing(corte)
    setForm({
      fecha: corte.fecha,
      efectivo: corte.efectivo.toString(),
      tarjeta: corte.tarjeta.toString(),
      observaciones: corte.observaciones || '',
    })
    setShowModal(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.fecha || !form.efectivo) {
      toast.error('Completa fecha y efectivo')
      return
    }
    setSaving(true)
    const payload = {
      fecha: form.fecha,
      efectivo: parseFloat(form.efectivo) || 0,
      tarjeta: parseFloat(form.tarjeta) || 0,
      total: totalCalculado,
      observaciones: form.observaciones,
    }
    try {
      if (editing) {
        setCortes(prev => prev.map(c => c.id === editing.id ? { ...c, ...payload } : c))
        toast.success('Corte actualizado')
      } else {
        const newId = Math.max(0, ...cortes.map(c => c.id)) + 1
        setCortes(prev => [...prev, { id: newId, ...payload }])
        toast.success('Corte registrado')
      }
      setShowModal(false)
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    setCortes(prev => prev.filter(c => c.id !== deleteConfirm.id))
    toast.success('Corte eliminado')
    setDeleteConfirm(null)
  }

  const formatCurrency = (val) => `$${val.toFixed(2)}`
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getDateRange = useCallback((key) => {
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    if (key === 'ayer') {
      start.setDate(start.getDate() - 1)
      end.setDate(end.getDate() - 1)
    } else if (key === 'semana') {
      const day = start.getDay()
      const diff = day === 0 ? -6 : 1 - day
      start.setDate(start.getDate() + diff)
    } else if (key === 'mes') {
      start.setDate(1)
    } else if (key === 'personalizado') {
      if (customStart) start.setTime(new Date(customStart).getTime())
      if (customEnd) end.setTime(new Date(customEnd + 'T23:59:59').getTime())
    }
    return { start, end }
  }, [customStart, customEnd])

  const filteredCortes = useMemo(() => {
    const { start, end } = getDateRange(filterKey)
    return cortes.filter(c => {
      const d = new Date(c.fecha + 'T12:00:00')
      return d >= start && d <= end
    })
  }, [cortes, filterKey, getDateRange])

  const filteredTotal = useMemo(() => filteredCortes.reduce((s, c) => s + c.total, 0), [filteredCortes])

  if (displayLoading) return <Loader fullScreen size={150} />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headingSerif}>Cortes de Caja</h1>
          <p className={styles.subheading}>Registro de cortes diarios</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>
          <Plus size={16} />
          Nuevo corte
        </button>
      </div>

      <div className={styles.filterBar}>
        {[
          { key: 'hoy', label: 'Hoy' },
          { key: 'ayer', label: 'Ayer' },
          { key: 'semana', label: 'Esta semana' },
          { key: 'mes', label: 'Este mes' },
          { key: 'personalizado', label: 'Personalizado' },
        ].map(opt => (
          <button
            key={opt.key}
            className={`${styles.filterChip} ${filterKey === opt.key ? styles.filterChipActive : ''}`}
            onClick={() => setFilterKey(opt.key)}
          >
            {opt.label}
          </button>
        ))}
        {filterKey === 'personalizado' && (
          <div className={styles.customDates}>
            <input type="date" className={styles.dateInput} value={customStart} onChange={e => setCustomStart(e.target.value)} />
            <span>—</span>
            <input type="date" className={styles.dateInput} value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
          </div>
        )}
        <span className={styles.totalLabel}>Total: <strong>${filteredTotal.toFixed(2)}</strong></span>
      </div>

      <div className={styles.tableWrap}>
        {filteredCortes.length === 0 ? (
          <p className={styles.empty}>No hay cortes en este período.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th className={styles.colAmount}>Efectivo</th>
                <th className={styles.colAmount}>Tarjeta</th>
                <th className={styles.colAmount}>Total</th>
                <th>Observaciones</th>
                <th className={styles.colActions}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCortes.map(corte => (
                <tr key={corte.id}>
                  <td className={styles.cellDate}>{formatDate(corte.fecha)}</td>
                  <td className={styles.cellAmount}>{formatCurrency(corte.efectivo)}</td>
                  <td className={styles.cellAmount}>{formatCurrency(corte.tarjeta)}</td>
                  <td className={styles.cellTotal}>{formatCurrency(corte.total)}</td>
                  <td className={styles.cellObs}>{corte.observaciones || '—'}</td>
                  <td className={styles.cellActions}>
                    <button className={styles.actionBtn} onClick={() => openEdit(corte)} title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => setDeleteConfirm(corte)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredCortes.length > 0 && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Total del período:</span>
            <span className={styles.summaryValue}>{formatCurrency(filteredTotal)}</span>
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Calculator size={18} />
                {editing ? 'Editar corte' : 'Nuevo corte'}
              </h2>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form className={styles.modalForm} onSubmit={handleSave}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Fecha</label>
                <input
                  className={styles.formInput}
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm({ ...form, fecha: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Efectivo ($)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.efectivo}
                    onChange={e => setForm({ ...form, efectivo: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Tarjeta ($)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.tarjeta}
                    onChange={e => setForm({ ...form, tarjeta: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Total calculado</label>
                <div className={styles.totalDisplay}>${totalCalculado.toFixed(2)}</div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Observaciones</label>
                <textarea
                  className={styles.formTextarea}
                  value={form.observaciones}
                  onChange={e => setForm({ ...form, observaciones: e.target.value })}
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className={styles.submitBtn} disabled={saving}>
                  <Save size={16} />
                  {saving ? 'Guardando...' : (editing ? 'Actualizar' : 'Registrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className={styles.overlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmCard} onClick={e => e.stopPropagation()}>
            <p className={styles.confirmText}>
              ¿Eliminar el corte del <strong>{formatDate(deleteConfirm.fecha)}</strong> por <strong>{formatCurrency(deleteConfirm.total)}</strong>?
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className={styles.deleteBtn} onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
