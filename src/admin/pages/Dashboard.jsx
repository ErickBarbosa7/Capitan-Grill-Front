import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMenuContext } from '../../contexts/MenuContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMinimumLoading } from '../../hooks/useMinimumLoading';
import { Loader } from '../../components/Loader';
import { useActivity } from '../../hooks/useActivity';
import { getMenuViews } from '../../services/menuService';
import { Plus, FolderPlus, ExternalLink, Pencil, EyeOff, Trash2, RotateCcw, Eye, TrendingUp, ChevronRight, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Dashboard.module.css';

const COLORS = ['#C9A87C', '#3A5A40', '#A0522D', '#2C2A29'];

const KPI_COLORS = {
  totalItems: '#C9A87C',
  totalCategories: '#A0522D',
  agotados: '#DC2626',
  menuViews: '#3A5A40',
};

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
  const displayLoading = useMinimumLoading(loading);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [greeting, setGreeting] = useState('');
  const [menuViews, setMenuViews] = useState(0);
  const { data: activityData } = useActivity({ pollInterval: 10000 })
  
  useEffect(() => {
    getMenuViews()
      .then(res => setMenuViews(res.count))
      .catch(() => toast.error('Error al cargar visitas'));
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 19) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  const stats = useMemo(() => {
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const totalCategories = categories.length;
    const agotados = categories.reduce((sum, cat) => sum + cat.items.filter((i) => !i.disponible).length, 0);
    const disponibles = totalItems - agotados;
    const disponibilidadPct = totalItems > 0 ? Math.round((disponibles / totalItems) * 100) : 0;

    const priceData = categories.flatMap((cat) =>
      cat.items.map((item) => ({
        name: t(`menu.items.${item.id}.name`, item.nombre),
        precio: item.precio,
        categoria: cat.nombre,
      }))
    );

    const categoryData = categories.map((cat) => ({
      name: cat.nombre,
      value: cat.items.length,
    }));

    const kpis = [
      { id: 'totalItems', label: 'Total en menú', value: totalItems, color: KPI_COLORS.totalItems, pct: 100 },
      { id: 'totalCategories', label: 'Categorías', value: totalCategories, color: KPI_COLORS.totalCategories, pct: totalCategories > 0 ? 100 : 0 },
      { id: 'agotados', label: 'Agotados', value: agotados, color: KPI_COLORS.agotados, pct: totalItems > 0 ? Math.round((agotados / totalItems) * 100) : 0 },
      { id: 'menuViews', label: 'Visitas hoy', value: menuViews, color: KPI_COLORS.menuViews, pct: Math.min(menuViews, 100) },
    ];

    return { totalItems, totalCategories, agotados, disponibles, disponibilidadPct, priceData, categoryData, kpis };
  }, [categories, t, menuViews]);

  const userName = user?.name || 'Erick';

  const today = new Date();
  const dateLabel = today.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateFormatted = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

  if (displayLoading) return <Loader fullScreen={true} size={150} />

  return (
    <div className={styles.page}>
      
      {/* ─── ENCABEZADO ─── */}
      <header className={styles.headerSection}>
        <div className={styles.greetingBox}>
          <span className={styles.dateLabel}>{dateFormatted}</span>
          <h1 className={styles.heading}>
            {greeting}, <span className={styles.headingName}>{userName}</span>
          </h1>
          <p className={styles.headingSub}>
            Tu menú se vio <strong>{menuViews}</strong> veces.
          </p>
        </div>

        <div className={styles.quickActions}>
          <button onClick={() => navigate('/admin/menu/nuevo')} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
            <Plus size={18} />
            <span>Agregar producto</span>
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

      {/* ─── FILA 1: KPIs con barra vertical ─── */}
      <div className={styles.cards}>
        {stats.kpis.map((kpi) => (
          <div key={kpi.id} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <p className={styles.cardLabel}>{kpi.label}</p>
                <p className={`${styles.cardValue} ${kpi.id === 'agotados' && kpi.value > 0 ? styles.cardValueRed : ''}`}>
                  {kpi.value}
                </p>
                <span className={styles.cardTrend} style={{ color: kpi.id === 'agotados' && kpi.value > 0 ? '#DC2626' : '#3A5A40' }}>
                  <TrendingUp size={12} />
                  +{kpi.pct}%
                </span>
              </div>
              <div className={styles.cardBarWrap}>
                <div
                  className={styles.cardBar}
                  style={{
                    height: `${Math.min(kpi.pct, 100)}%`,
                    background: kpi.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── FILA 2: Gráfico + Tasa de disponibilidad ─── */}
      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Distribución de precios</h2>
            <span className={styles.chartBadge}>General</span>
          </div>
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
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Disponibilidad</h2>
            <span className={styles.chartBadge}>Menú</span>
          </div>
          <div className={styles.rateCard}>
            <p className={styles.rateValue}>{stats.disponibilidadPct}%</p>
            <p className={styles.rateSub}>
              <CheckCircle size={14} />
              {stats.disponibles} de {stats.totalItems} disponibles
            </p>
            <div className={styles.rateBar}>
              <div
                className={styles.rateBarFill}
                style={{ width: `${stats.disponibilidadPct}%` }}
              />
            </div>
            <p className={styles.rateTrend}>
              <TrendingUp size={13} />
              {stats.disponibilidadPct >= 80 ? 'Buena disponibilidad' : 'Algunos agotados'}
            </p>
            <div className={styles.rateActions}>
              <button className={styles.rateBtnOutline} onClick={() => navigate('/admin/menu')}>
                Ver menú
              </button>
              <button className={styles.rateBtnPrimary} onClick={() => window.open('/', '_blank')}>
                Vista pública
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FILA 3: Tabla de actividad + Desglose por categoría ─── */}
      <div className={styles.bottomGrid}>
        <div className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <h2 className={styles.sectionHeading}>Últimos movimientos</h2>
            {activityData.length > 0 && (
              <button className={styles.seeAllBtn} onClick={() => navigate('/admin/actividad')}>
                Ver todos <ChevronRight size={14} />
              </button>
            )}
          </div>
          <div className={styles.activityTable}>
            {activityData.length === 0 ? (
              <p className={styles.emptyActivity}>Aún no hay movimientos registrados</p>
            ) : (
              activityData.slice(0, 5).map((entry) => (
                <div key={entry.id} className={styles.activityRow}>
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

        <div className={styles.breakdownSection}>
          <div className={styles.activityHeader}>
            <h2 className={styles.sectionHeading}>Volumen por categoría</h2>
          </div>
          <div className={styles.breakdownList}>
            {stats.categoryData.map((cat, i) => {
              const maxVal = Math.max(...stats.categoryData.map(c => c.value), 1)
              const pct = Math.round((cat.value / maxVal) * 100)
              return (
                <div key={cat.name} className={styles.breakdownItem}>
                  <div className={styles.breakdownTop}>
                    <div className={styles.breakdownIcon} style={{ background: `${COLORS[i % COLORS.length]}22`, color: COLORS[i % COLORS.length] }}>
                      <PieChartIcon />
                    </div>
                    <span className={styles.breakdownCat}>{cat.name}</span>
                    <span className={styles.breakdownCount}>{cat.value}</span>
                  </div>
                  <div className={styles.breakdownBar}>
                    <div
                      className={styles.breakdownBarFill}
                      style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                    />
                    <span className={styles.breakdownPct}>{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}

function PieChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
