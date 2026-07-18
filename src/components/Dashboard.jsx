import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './Dashboard.css'

const IconBox = ({ color, path }) => (
	<span className="icon-box" style={{ background: `${color}1a`, color }} aria-hidden="true">
		<svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
			<path d={path} />
		</svg>
	</span>
)

const icons = {
	inventory: 'M4 7v10l8 4 8-4V7l-8-4-8 4zm2 2.54l6 3 6-3v.01L12 13l-6-3.46V9.54zM6 14.46l6 3 6-3v.01L12 17l-6-3.46v-1.08z',
	check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
	truck: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
	warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
}

const statusConfig = {
	'En ruta':    { color: '#38bdf8', label: 'EN RUTA' },
	'Entregado':  { color: '#10b981', label: 'ENTREGADO' },
	'Pendiente':  { color: '#f1a02b', label: 'PENDIENTE' },
	'Incidente':  { color: '#ffb4ab', label: 'INCIDENTE' },
}

const weeklyData = [
	{ day: 'LUN', cargados: 185, entregados: 150 },
	{ day: 'MAR', cargados: 200, entregados: 175 },
	{ day: 'MIE', cargados: 165, entregados: 190 },
	{ day: 'JUE', cargados: 215, entregados: 205 },
	{ day: 'VIE', cargados: 130, entregados: 120 },
	{ day: 'SAB', cargados: 85,  entregados: 70  },
	{ day: 'DOM', cargados: 35,  entregados: 25  },
]

export const Dashboard = ({ packages }) => {
	const navigate = useNavigate()

	const total = packages.length
	const enRuta = packages.filter(p => p?.packages?.[0]?.status === 'En ruta').length
	const entregados = packages.filter(p => p?.packages?.[0]?.status === 'Entregado').length
	const pendientes = packages.filter(p => !p?.packages?.[0]?.status || p.packages[0].status === 'not delivered').length

	const statusData = [
		{ name: 'En Ruta',     value: enRuta,     color: '#38bdf8' },
		{ name: 'Entregados',  value: entregados, color: '#10b981' },
		{ name: 'Pendientes',  value: pendientes, color: '#f1a02b' },
	].filter(d => d.value > 0)

	const recent = [...packages].sort((a, b) => new Date(b.dateCreatedAt) - new Date(a.dateCreatedAt)).slice(0, 5)
	const totalDist = statusData.reduce((s, d) => s + d.value, 0)

	return (
		<>
			<Helmet>
				<title>Panel de Control — Logistic Manager</title>
				<meta name="description" content="Panel de administración con indicadores clave, rendimiento semanal, distribución de estados y actividad reciente." />
				<meta property="og:title" content="Panel de Control — Logistic Manager" />
				<meta property="og:description" content="Panel de administración con indicadores clave, rendimiento semanal, distribución de estados y actividad reciente." />
				<meta name="twitter:title" content="Panel de Control — Logistic Manager" />
				<meta name="twitter:description" content="Panel de administración con indicadores clave, rendimiento semanal, distribución de estados y actividad reciente." />
			</Helmet>
			<div className="dashboard">
			<div className="page-header">
				<div>
					<h1 className="dashboard-title">Panel de Control</h1>
					<p className="dashboard-subtitle">Resumen operativo en tiempo real</p>
				</div>
				<div className="page-actions">
					<button className="btn-outline" aria-label="Filtrar dashboard">
						<svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
						FILTRAR
					</button>
					<button className="btn-primary" onClick={() => navigate('/cargar')} aria-label="Crear nuevo envío">
						<svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
						NUEVO ENVÍO
					</button>
				</div>
			</div>

			<section className="kpi-grid" aria-label="Indicadores clave de rendimiento">
				<article className="kpi-card">
					<div className="kpi-header">
						<span className="kpi-label">Total Paquetes</span>
						<IconBox color="#38bdf8" path={icons.inventory} />
					</div>
					<div className="kpi-value-row">
						<span className="kpi-value">{total}</span>
						<span className="kpi-trend trend-up">▲ +4.2%</span>
					</div>
				</article>
				<article className="kpi-card">
					<div className="kpi-header">
						<span className="kpi-label">Entregados</span>
						<IconBox color="#10b981" path={icons.check} />
					</div>
					<div className="kpi-value-row">
						<span className="kpi-value">{entregados}</span>
						<span className="kpi-trend trend-up">▲ +1.8%</span>
					</div>
				</article>
				<article className="kpi-card">
					<div className="kpi-header">
						<span className="kpi-label">En Tránsito</span>
						<IconBox color="#f1a02b" path={icons.truck} />
					</div>
					<div className="kpi-value-row">
						<span className="kpi-value">{enRuta}</span>
						<span className="kpi-trend trend-flat">◆ ESTABLE</span>
					</div>
				</article>
				<article className="kpi-card">
					<div className="kpi-header">
						<span className="kpi-label">Pendientes</span>
						<IconBox color="#ffb4ab" path={icons.warning} />
					</div>
					<div className="kpi-value-row">
						<span className="kpi-value">{pendientes}</span>
						<span className="kpi-trend trend-down">▼ -2.1%</span>
					</div>
				</article>
			</section>

			{total > 0 && (
				<section className="charts-grid" aria-label="Gráficos de rendimiento">
					<div className="chart-card chart-wide">
						<div className="chart-header">
							<h3 className="chart-title">Rendimiento Semanal</h3>
							<div className="chart-legend">
								<span className="legend-item"><span className="legend-dot" style={{ background: '#38bdf8' }}></span>Cargados</span>
								<span className="legend-item"><span className="legend-dot" style={{ background: '#f1a02b' }}></span>Entregados</span>
							</div>
						</div>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={weeklyData} barGap={4} barCategoryGap="20%">
								<CartesianGrid strokeDasharray="3 3" stroke="#3e484f" vertical={false} />
								<XAxis dataKey="day" tick={{ fill: '#bdc8d1', fontSize: 12 }} axisLine={{ stroke: '#3e484f' }} tickLine={false} />
								<YAxis tick={{ fill: '#bdc8d1', fontSize: 12 }} axisLine={false} tickLine={false} />
								<Tooltip contentStyle={{ background: '#222a3d', border: '1px solid #3e484f', borderRadius: 8, color: '#dae2fd' }} />
								<Bar dataKey="cargados" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Cargados" />
								<Bar dataKey="entregados" fill="#f1a02b" radius={[4, 4, 0, 0]} name="Entregados" />
							</BarChart>
						</ResponsiveContainer>
					</div>

					<div className="chart-card">
						<h3 className="chart-title">Distribución de Estados</h3>
						<div className="doughnut-wrapper">
							<ResponsiveContainer width="100%" height={220}>
								<PieChart>
									<Pie data={statusData} innerRadius={65} outerRadius={90} dataKey="value" paddingAngle={3}>
										{statusData.map((entry, i) => (
											<Cell key={i} fill={entry.color} />
										))}
									</Pie>
									<Tooltip contentStyle={{ background: '#222a3d', border: '1px solid #3e484f', borderRadius: 8, color: '#dae2fd' }} />
								</PieChart>
							</ResponsiveContainer>
							<div className="doughnut-center">
								<span className="doughnut-value">{total}</span>
								<span className="doughnut-label">TOTAL</span>
							</div>
						</div>
						<div className="doughnut-legend">
							{statusData.map((d, i) => (
								<div key={i} className="doughnut-legend-item">
									<span className="legend-dot" style={{ background: d.color }}></span>
									<span className="legend-text">{d.name}</span>
									<span className="legend-pct">{Math.round(d.value / totalDist * 100)}%</span>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			<section className="activity-section" aria-label="Actividad reciente">
				<h3 className="section-title">Actividad Reciente</h3>
				<div className="activity-list" role="list">
					{recent.map((pkg, i) => {
						const status = pkg?.packages?.[0]?.status || 'Pendiente'
						const cfg = statusConfig[status] || statusConfig.Pendiente
						const timeAgo = pkg?.dateCreatedAt ? (() => {
							const diff = Date.now() - new Date(pkg.dateCreatedAt).getTime()
							const mins = Math.floor(diff / 60000)
							if (mins < 60) return `Hace ${mins} min`
							const hrs = Math.floor(mins / 60)
							return hrs === 1 ? 'Hace 1 hora' : `Hace ${hrs} horas`
						})() : ''
						return (
							<Link key={i} to={`/direccion/${encodeURIComponent(pkg.address)}`} className="activity-item" role="listitem">
								<div className="activity-left">
									<span className="activity-icon" style={{ background: `${cfg.color}1a`, color: cfg.color }} aria-hidden="true">
										<svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
											<path d={status === 'Entregado' ? icons.check : status === 'Pendiente' ? icons.warning : icons.truck} />
										</svg>
									</span>
									<div>
										<div className="activity-name">{pkg?.name || ''}</div>
										<div className="activity-meta">{(pkg.address || '') + ', ' + (pkg?.city || '')}</div>
									</div>
								</div>
								<div className="activity-right">
									<span className="status-chip" style={{ background: `${cfg.color}1a`, color: cfg.color }}>{cfg.label}</span>
									<span className="activity-time">{timeAgo}</span>
								</div>
							</Link>
						)
					})}
					{recent.length === 0 && <p className="empty-hint">No hay actividad reciente</p>}
				</div>
			</section>
		</div>
		</>
	)
}
