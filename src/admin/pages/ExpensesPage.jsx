import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, X, Save, Receipt, FileDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import CategoryDropdown from '../components/CategoryDropdown'
import {
  getExpenses, createExpense, updateExpense, deleteExpense,
  getExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory,
} from '../../services/expenseService'
import jsPDF from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { useMinimumLoading } from '../../hooks/useMinimumLoading'
import { Loader } from '../../components/Loader'
import styles from './ExpensesPage.module.css'

export default function ExpensesPage() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const displayLoading = useMinimumLoading(loading)

  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState({ person: '', description: '', amount: '', date: '', categoryId: '' })

  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filterKey, setFilterKey] = useState('mes')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const getDateRange = useCallback((key) => {
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    if (key === 'semana') {
      const day = start.getDay()
      const diff = day === 0 ? -6 : 1 - day
      start.setDate(start.getDate() + diff)
    } else if (key === 'mes') {
      start.setDate(1)
    } else if (key === 'trimestre') {
      start.setDate(1)
      start.setMonth(start.getMonth() - 2)
    } else if (key === 'personalizado') {
      if (customStart) start.setTime(new Date(customStart).getTime())
      if (customEnd) end.setTime(new Date(customEnd + 'T23:59:59').getTime())
    }
    return { start, end }
  }, [customStart, customEnd])

  const filteredExpenses = useMemo(() => {
    const { start, end } = getDateRange(filterKey)
    return expenses.filter(exp => {
      const d = new Date(exp.date)
      return d >= start && d <= end
    })
  }, [expenses, filterKey, getDateRange])

  const totalSum = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
  }, [filteredExpenses])



  const dropdownCategories = useMemo(() =>
    categories.map(cat => ({ id: cat.id.toString(), nombre: cat.name, nombreEs: cat.name })),
  [categories])

  const fetchData = useCallback(async () => {
    try {
      const [exp, cats] = await Promise.all([getExpenses(), getExpenseCategories()])
      setExpenses(exp)
      setCategories(cats)
    } catch (err) {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const todayStr = () => new Date().toISOString().split('T')[0]

  const openCreateExpense = () => {
    setEditingExpense(null)
    setExpenseForm({ person: user?.name || '', description: '', amount: '', date: todayStr(), categoryId: categories[0]?.id?.toString() || '', userEmail: user?.email || '' })
    setShowExpenseModal(true)
  }

  const openEditExpense = (exp) => {
    setEditingExpense(exp)
    setExpenseForm({
      person: exp.person,
      description: exp.description,
      amount: exp.amount.toString(),
      date: exp.date.slice(0, 10),
      categoryId: exp.categoryId.toString(),
    })
    setShowExpenseModal(true)
  }

  const handleSaveExpense = async (e) => {
    e.preventDefault()
    if (!expenseForm.description.trim() || !expenseForm.amount || !expenseForm.categoryId) {
      toast.error('Completa todos los campos')
      return
    }
    const previous = expenses
    setSaving(true)
    try {
      if (editingExpense) {
        const res = await updateExpense(editingExpense.id, expenseForm)
        setExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? { ...exp, ...res.expense } : exp))
        toast.success('Gasto actualizado')
      } else {
        const res = await createExpense(expenseForm)
        setExpenses(prev => [...prev, res.expense])
        toast.success('Gasto registrado')
      }
      setShowExpenseModal(false)
    } catch (err) {
      setExpenses(previous)
      toast.error(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExpense = async () => {
    if (!deleteConfirm) return
    const previous = expenses
    setExpenses(prev => prev.filter(e => e.id !== deleteConfirm.id))
    try {
      await deleteExpense(deleteConfirm.id)
      toast.success('Gasto eliminado')
      setDeleteConfirm(null)
    } catch (err) {
      setExpenses(previous)
      toast.error(err.message || 'Error al eliminar')
    }
  }

  const handleCreateCategory = async (data) => {
    const previous = categories
    try {
      const res = await createExpenseCategory({ name: data.nameEs })
      setCategories(prev => [...prev, res.category])
      toast.success('Categoría creada')
    } catch (err) {
      setCategories(previous)
      toast.error(err.message || 'Error al crear categoría')
    }
  }

  const handleUpdateCategory = async (id, data) => {
    const previous = categories
    try {
      const res = await updateExpenseCategory(id, { name: data.nameEs })
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...res.category } : c))
      toast.success('Categoría actualizada')
    } catch (err) {
      setCategories(previous)
      toast.error(err.message || 'Error al actualizar categoría')
    }
  }

  const handleDeleteCategory = async (id) => {
    const previous = categories
    setCategories(prev => prev.filter(c => c.id !== id))
    try {
      await deleteExpenseCategory(id)
      toast.success('Categoría eliminada')
    } catch (err) {
      setCategories(previous)
      toast.error(err.message || 'Error al eliminar categoría')
    }
  }

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const downloadPDF = useCallback(() => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Gastos - Capitán Grill', 14, 16)
    doc.setFontSize(10)
    const firstDate = filteredExpenses[0]?.date
    const lastDate = filteredExpenses[filteredExpenses.length - 1]?.date
    if (firstDate && lastDate) {
      doc.text(`Período: ${formatDate(firstDate)} - ${formatDate(lastDate)}`, 14, 23)
    }
    autoTable(doc, {
      startY: 28,
      head: [['Fecha', 'Persona', 'Categoría', 'Descripción', 'Monto']],
      body: filteredExpenses.map(exp => [
        formatDate(exp.date),
        exp.person,
        exp.category?.name || '—',
        exp.description,
        `$${Number(exp.amount).toFixed(2)}`,
      ]),
      foot: [['', '', '', 'Total', `$${totalSum.toFixed(2)}`]],
      styles: { fontSize: 8 },
      footStyles: { fillColor: [201, 168, 124] },
    })
    doc.save('gastos.pdf')
  }, [filteredExpenses, totalSum])

  if (displayLoading) return <Loader fullScreen={true} size={150} />

  return (
    <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.headingSerif}>Gastos</h1>
            <p className={styles.subheading}>Registro de gastos del negocio</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnSecondary} onClick={downloadPDF} disabled={filteredExpenses.length === 0}>
              <FileDown size={16} />
              PDF
            </button>
            <button className={styles.btnPrimary} onClick={openCreateExpense}>
              <Plus size={16} />
              Agregar gasto
            </button>
          </div>
        </div>

        <div className={styles.filterBar}>
          {[
            { key: 'semana', label: 'Esta semana' },
            { key: 'mes', label: 'Este mes' },
            { key: 'trimestre', label: 'Últimos 3 meses' },
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
          <span className={styles.totalLabel}>Total: <strong>${totalSum.toFixed(2)}</strong></span>
        </div>

        <div className={styles.tableWrap}>
        {expenses.length === 0 ? (
          <p className={styles.empty}>No hay gastos registrados aún.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Persona</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th className={styles.colAmount}>Monto</th>
                <th className={styles.colActions}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td className={styles.cellDate}>{formatDate(exp.date)}</td>
                  <td title={exp.userEmail || ''}>{exp.person}</td>
                  <td><span className={styles.categoryBadge}>{exp.category?.name}</span></td>
                  <td className={styles.cellDesc}>{exp.description}</td>
                  <td className={styles.cellAmount}>{formatAmount(exp.amount)}</td>
                  <td className={styles.cellActions}>
                    {exp.userEmail && exp.userEmail !== user?.email ? (
                      <span className={styles.lockedBadge} title="Registrado por otro usuario">—</span>
                    ) : (
                      <>
                        <button className={styles.actionBtn} onClick={() => openEditExpense(exp)} title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => setDeleteConfirm(exp)} title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showExpenseModal && (
        <div className={styles.overlay} onClick={() => setShowExpenseModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Receipt size={18} />
                {editingExpense ? 'Editar gasto' : 'Nuevo gasto'}
              </h2>
              <button className={styles.modalClose} onClick={() => setShowExpenseModal(false)}><X size={20} /></button>
            </div>
            <form className={styles.modalForm} onSubmit={handleSaveExpense}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Registrado por</label>
                  <input className={styles.formInput} value={expenseForm.person} disabled />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Categoría</label>
                    <CategoryDropdown
                      translation={false}
                      categories={dropdownCategories}
                      value={expenseForm.categoryId}
                      onChange={(id) => setExpenseForm({ ...expenseForm, categoryId: id })}
                      onCreate={handleCreateCategory}
                      onUpdate={handleUpdateCategory}
                      onDelete={handleDeleteCategory}
                    />
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Descripción</label>
                <input className={styles.formInput} value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="¿Qué se compró?" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Monto</label>
                  <input className={styles.formInput} type="number" step="0.01" min="0" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} placeholder="0.00" />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Fecha</label>
                  <input className={styles.formInput} type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowExpenseModal(false)}>Cancelar</button>
                <button type="submit" className={styles.submitBtn} disabled={saving}>
                  <Save size={16} />
                  {saving ? 'Guardando...' : (editingExpense ? 'Actualizar' : 'Registrar')}
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
              ¿Eliminar el gasto de <strong>{deleteConfirm.person}</strong> por <strong>{formatAmount(deleteConfirm.amount)}</strong>?
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className={styles.deleteBtn} onClick={handleDeleteExpense}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
