import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActivity } from '../services/menuService'
import Loading from '../components/Loading'
import { ArrowLeft, Plus, Pencil, EyeOff, Trash2, RotateCcw } from 'lucide-react'
import styles from './ActivityPage.module.css'

const ACTIVITY_ICONS = {
  add: <Plus size={16} />,
  edit: <Pencil size={16} />,
  hide: <EyeOff size={16} />,
  show: <EyeOff size={16} />,
  delete: <Trash2 size={16} />,
  restore: <RotateCcw size={16} />,
}

function formatFullTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Ayer'
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ActivityPage() {
  const navigate = useNavigate()
  const [activityData, setActivityData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchActivity = useCallback(async () => {
    try {
      const data = await getActivity()
      setActivityData(data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/admin')}>
        <ArrowLeft size={20} /> Inicio
      </button>

      <h1 className={styles.heading}>Todos los movimientos</h1>

      {loading ? (
        <Loading />
      ) : activityData.length === 0 ? (
        <p className={styles.empty}>Aún no hay movimientos registrados</p>
      ) : (
        <div className={styles.list}>
          {activityData.map((entry) => (
            <div key={entry.id} className={styles.item}>
              <div className={`${styles.icon} ${styles[`icon_${entry.type}`]}`}>
                {ACTIVITY_ICONS[entry.type] || <Pencil size={16} />}
              </div>
              <div className={styles.text}>
                <span className={styles.action}>{entry.action}</span>
                <span className={styles.target}> {entry.target}</span>
              </div>
              <div className={styles.time}>{formatFullTime(entry.time)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
