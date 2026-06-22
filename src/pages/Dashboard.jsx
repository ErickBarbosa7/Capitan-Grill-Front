import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMenuContext } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import { getActivity } from '../services/menuService';
import { Plus, FolderPlus, ExternalLink, Pencil, EyeOff, Trash2, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Dashboard.module.css';

const COLORS = ['#C9A87C', '#3A5A40', '#A0522D', '#2C2A29'];

function formatTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

const ACTIVITY_ICONS = {
  add: <Plus size={16} />,
  edit: <Pencil size={16} />,
  hide: <EyeOff size={16} />,
  show: <EyeOff size={16} />,
  delete: <Trash2 size={16} />,
  restore: <RotateCcw size={16} />,
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { categories, loading } = useMenuContext();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [greeting, setGreeting] = useState('');
  const [activityData, setActivityData] = useState([]);
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 19) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const data = await getActivity()
      setActivityData(data)
    } catch {}
  }, [])

  useEffect(() => {
    fetchActivity()
    const interval = setInterval(fetchActivity, 10000)
    return () => clearInterval(interval)
  }, [fetchActivity])

  const stats = useMemo(() => {
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const totalCategories = categories.length;
    const agotados = categories.reduce((sum, cat) => sum + cat.items.filter((i) => !i.disponible).length, 0);

    const priceData = categories.flatMap((cat) =>
      cat.items.map((item) => ({
        name: t(`menu.items.${item.id}.name`, item.nombre),
        precio: item.precio,
        categoria: t(`menu.categories.${cat.id}`, cat.nombre),
      }))
    );

    const categoryData = categories.map((cat) => ({
      name: t(`menu.categories.${cat.id}`, cat.nombre),
      value: cat.items.length,
    }));

    return { totalItems, totalCategories, agotados, priceData, categoryData };
  }, [categories, t]);

  const userName = user?.name || 'Erick';

  if (loading) return <Loading />

  return (
    <div className={styles.page}>
      
      {/* ─── ENCABEZADO PERSONALIZADO Y ACCIONES RÁPIDAS ─── */}
      <header className={styles.headerSection}>
        <div className={styles.greetingBox}>
          <span className={styles.preHeading}>{greeting}, {userName}</span>
          <h1 className={styles.heading}>¿Qué hacemos hoy?</h1>
        </div>

        <div className={styles.quickActions}>
          <button onClick={() => navigate('/admin/menu/nuevo')} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
            <Plus size={18} />
            <span>Agregar platillo</span>
          </button>
          
          <button onClick={() => navigate('/admin/categorias')} className={styles.actionBtn}>
            <FolderPlus size={18} />
            <span>Categorías</span>
          </button>

          <button onClick={() => window.open('/', '_blank')} className={styles.actionBtn}>
            <ExternalLink size={18} />
            <span>Ver menú público</span>
          </button>
        </div>
      </header>

      {/* ─── TARJETAS DE MÉTRICAS (KPIs) ─── */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.cardValue}>{stats.totalItems}</p>
          <p className={styles.cardLabel}>Total en menú</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardValue}>{stats.totalCategories}</p>
          <p className={styles.cardLabel}>Categorías activas</p>
        </div>
        <div className={styles.card}>
          <p className={`${styles.cardValue} ${stats.agotados > 0 ? styles.cardValueRed : ''}`}>
            {stats.agotados}
          </p>
          <p className={styles.cardLabel}>Platillos agotados</p>
        </div>
      </div>

      {/* ─── GRÁFICOS ─── */}
      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Distribución de precios</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.priceData} margin={{ bottom: 60, left: -20, right: 0, top: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8A8680', fontFamily: 'Inter' }} axisLine={{ stroke: 'rgba(0,0,0,0.05)' }} tickLine={false} angle={-35} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 11, fill: '#8A8680', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{ fill: 'rgba(201, 168, 124, 0.1)' }} contentStyle={{ fontFamily: 'Inter', fontSize: 13, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} formatter={(value) => [`$${value}`, 'Precio']} />
              <Bar dataKey="precio" fill="#C9A87C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Volumen por categoría</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stats.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={55} stroke="none" label={({ name, value }) => `${name} (${value})`} labelLine={{ stroke: '#8A8680', strokeWidth: 0.5 }}>
                {stats.categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: 13, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── ACTIVIDAD RECIENTE ─── */}
      <div className={styles.activitySection}>
        <div className={styles.activityHeader}>
          <h2 className={styles.sectionHeading}>Últimos movimientos</h2>
          {activityData.length > 0 && (
            <button className={styles.seeAllBtn} onClick={() => navigate('/admin/actividad')}>
              Ver todos
            </button>
          )}
        </div>
        <div className={styles.activityList}>
          {activityData.length === 0 ? (
            <p className={styles.emptyActivity}>Aún no hay movimientos registrados</p>
          ) : (
            activityData.slice(0, 5).map((entry) => (
              <div key={entry.id} className={styles.activityItem}>
                <div className={`${styles.activityIcon} ${styles[`icon_${entry.type}`]}`}>
                  {ACTIVITY_ICONS[entry.type] || <Pencil size={16} />}
                </div>
                <div className={styles.activityText}>
                  <span className={styles.activityAction}>{entry.action}</span>
                  <span className={styles.activityTarget}> {entry.target}</span>
                </div>
                <div className={styles.activityTime}>{formatTime(entry.time)}</div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}