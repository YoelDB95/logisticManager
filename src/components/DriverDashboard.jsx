import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './DriverDashboard.css'

const weeklyData = [
	{ day: 'LUN', entregas: 70, objetivo: 90 },
	{ day: 'MAR', entregas: 85, objetivo: 80 },
	{ day: 'MIE', entregas: 95, objetivo: 85 },
	{ day: 'JUE', entregas: 100, objetivo: 95 },
	{ day: 'VIE', entregas: 0,  objetivo: 90 },
	{ day: 'SAB', entregas: 0,  objetivo: 60 },
]

const routeStops = [
	{
		label: 'EN PROGRESO',
		time: '14:45',
		address: 'Av. Insurgentes 452',
		detail: 'Paquete #5521 • Express',
		active: true,
	},
	{
		label: 'Siguiente Parada',
		time: 'Est. 15:10',
		address: 'Calle Roble 12',
		detail: 'Paquete #5522 • Estándar',
		active: false,
	},
	{
		label: 'Parada 3',
		time: 'Est. 15:40',
		address: 'Av. Revolución 890',
		detail: 'Paquete #5530 • Frágil',
		active: false,
	},
	{
		label: 'Parada 4',
		time: 'Est. 16:15',
		address: 'Plaza Satélite L-14',
		detail: 'Paquete #5541 • Express',
		active: false,
	},
]

const statusChip = {
	'Entregado':     { bg: 'rgba(56,189,248,0.1)', color: '#38bdf8', label: 'ENTREGADO' },
	'Firma Pendiente': { bg: 'rgba(241,160,43,0.1)', color: '#f1a02b', label: 'FIRMA PENDIENTE' },
}

const recentDeliveries = [
	{ id: '#4491-X', destino: 'Torre Mapfre, Piso 12', time: '14:12 PM', status: 'Entregado' },
	{ id: '#4488-Z', destino: 'Calle Gral. Prim 24',   time: '13:45 PM', status: 'Entregado' },
	{ id: '#4485-A', destino: 'Av. Reforma 222',        time: '13:20 PM', status: 'Firma Pendiente' },
	{ id: '#4482-B', destino: 'Colonia del Valle 101',  time: '12:50 PM', status: 'Entregado' },
	{ id: '#4479-K', destino: 'Insurgentes Sur 300',    time: '12:10 PM', status: 'Entregado' },
]

export const DriverDashboard = ({ packages }) => {
	const entregasHoy = packages.filter(p =>
		p?.packages?.[0]?.status === 'Entregado' ||
		p?.packages?.[0]?.status === 'En ruta'
	).length
	const metaDiaria = 30
	const progreso = Math.min(Math.round((entregasHoy / metaDiaria) * 100), 100)

	return (
		<div className="driver-dashboard">
			<div className="dd-header">
				<div>
					<h1 className="dd-title">Resumen de Desempeño</h1>
					<p className="dd-subtitle">Bienvenido de nuevo, Carlos. Aquí están tus estadísticas de hoy.</p>
				</div>
				<div className="dd-actions">
					<button className="dd-btn-download" aria-label="Descargar reporte">
						<svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
						DESCARGAR REPORTE
					</button>
				</div>
			</div>

			<section className="dd-metrics" aria-label="Métricas de desempeño">
				<article className="dd-card">
					<div className="dd-card-top">
						<span className="dd-card-label">Entregas Hoy</span>
						<span className="dd-card-icon" style={{ color: '#38bdf8' }} aria-hidden="true">
							<svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
						</span>
					</div>
					<div className="dd-card-value">
						{entregasHoy}<span className="dd-card-suffix">/{metaDiaria}</span>
					</div>
					<div className="dd-progress-bar">
						<div className="dd-progress-fill" style={{ width: `${progreso}%` }}></div>
					</div>
				</article>

				<article className="dd-card">
					<div className="dd-card-top">
						<span className="dd-card-label">Eficiencia Ruta</span>
						<span className="dd-card-icon" style={{ color: '#ffc176' }} aria-hidden="true">
							<svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15.5 15.38c-.69 0-1.31.28-1.77.74l-4.84-2.76c.05-.22.11-.44.11-.68 0-.24-.06-.46-.11-.68l4.7-2.7c.49.42 1.12.7 1.86.7 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.06.46.11.68l-4.7 2.7c-.49-.42-1.12-.7-1.86-.7-1.66 0-3 1.34-3 3s1.34 3 3 3c.74 0 1.37-.28 1.86-.7l4.84 2.76c-.05.22-.11.44-.11.68 0 1.66 1.34 3 3 3s3-1.34 3-3-1.35-3-3.01-3z"/></svg>
						</span>
					</div>
					<div className="dd-card-value">
						92<span className="dd-card-suffix">%</span>
					</div>
					<div className="dd-card-trend trend-up">
						<svg fill="currentColor" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 14l5-5 5 5z"/></svg>
						+3.2% vs ayer
					</div>
				</article>

				<article className="dd-card">
					<div className="dd-card-top">
						<span className="dd-card-label">Promedio Entrega</span>
						<span className="dd-card-icon" style={{ color: '#38bdf8' }} aria-hidden="true">
							<svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
						</span>
					</div>
					<div className="dd-card-value">
						18<span className="dd-card-suffix"> min</span>
					</div>
					<div className="dd-card-trend trend-neutral">
						Optimizado: -2m
					</div>
				</article>

				<article className="dd-card">
					<div className="dd-card-top">
						<span className="dd-card-label">Calificación</span>
						<span className="dd-card-icon" style={{ color: '#38bdf8' }} aria-hidden="true">
							<svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
						</span>
					</div>
					<div className="dd-card-value">
						4.8<span className="dd-card-suffix">/5</span>
					</div>
					<div className="dd-stars" aria-label="4.8 de 5 estrellas">
						{Array.from({ length: 4 }, (_, i) => (
							<svg key={i} fill="#f1a02b" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
						))}
						<svg fill="#f1a02b" viewBox="0 0 24 24" width="14" height="14" style={{ opacity: 0.5 }} aria-hidden="true">
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
						</svg>
					</div>
				</article>
			</section>

			<div className="dd-main-grid">
				<section className="dd-chart-card" aria-label="Gráfico de desempeño semanal">
					<div className="dd-chart-header">
						<div>
							<h2 className="dd-chart-title">Desempeño Semanal</h2>
							<span className="dd-chart-subtitle">COMPARATIVA: REALIZADO VS OBJETIVOS</span>
						</div>
						<div className="dd-chart-legend">
							<span className="legend-item"><span className="legend-dot" style={{ background: '#38bdf8' }}></span>ENTREGAS</span>
							<span className="legend-item"><span className="legend-dot" style={{ border: '2px solid #87929a', background: 'transparent' }}></span>OBJETIVO</span>
						</div>
					</div>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={weeklyData} barGap={4} barCategoryGap="20%">
							<CartesianGrid strokeDasharray="3 3" stroke="#3e484f" vertical={false} />
							<XAxis dataKey="day" tick={{ fill: '#bdc8d1', fontSize: 12 }} axisLine={{ stroke: '#3e484f' }} tickLine={false} />
							<YAxis tick={{ fill: '#bdc8d1', fontSize: 12 }} axisLine={false} tickLine={false} />
							<Tooltip contentStyle={{ background: '#222a3d', border: '1px solid #3e484f', borderRadius: 8, color: '#dae2fd' }} />
							<Bar dataKey="entregas" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Entregas" opacity={0.8} />
							<Bar dataKey="objetivo" fill="transparent" stroke="#87929a" strokeDasharray="4 3" strokeWidth={2} radius={[4, 4, 0, 0]} name="Objetivo" />
						</BarChart>
					</ResponsiveContainer>
				</section>

				<aside className="dd-route-card" aria-label="Resumen de ruta actual">
					<div className="dd-route-header">
						<div>
							<h2 className="dd-chart-title">Ruta Actual</h2>
							<span className="dd-route-sector">SECTOR: NORTE-CENTRO</span>
						</div>
						<button className="dd-route-more" aria-label="Más opciones de ruta">
							<svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
						</button>
					</div>
					<div className="dd-route-timeline">
						{routeStops.map((stop, i) => (
							<div key={i} className="dd-route-stop">
								<div className="dd-timeline-line"></div>
								<div className={`dd-timeline-dot ${stop.active ? 'active' : ''}`}></div>
								<div className={`dd-stop-card ${stop.active ? 'active' : ''}`}>
									<div className="dd-stop-top">
										<span className="dd-stop-label" style={{ color: stop.active ? '#38bdf8' : '#bdc8d1' }}>{stop.label}</span>
										<span className="dd-stop-time">{stop.time}</span>
									</div>
									<div className="dd-stop-address">{stop.address}</div>
									<div className="dd-stop-detail">{stop.detail}</div>
									{stop.active && (
										<div className="dd-stop-actions">
											<button className="dd-btn-nav" aria-label="Navegar a esta dirección">
												<svg fill="currentColor" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
												NAVEGAR
											</button>
											<button className="dd-btn-detail">DETALLES</button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</aside>
			</div>

			<section className="dd-table-section" aria-label="Últimas entregas">
				<div className="dd-table-header">
					<h2 className="dd-chart-title">Últimas Entregas</h2>
					<button className="dd-link-all">VER TODAS</button>
				</div>
				<div className="dd-table-scroll">
					<table className="dd-table">
						<thead>
							<tr>
								<th scope="col">ID ENVÍO</th>
								<th scope="col">DESTINO</th>
								<th scope="col">FINALIZADO</th>
								<th scope="col">ESTADO</th>
								<th scope="col" className="th-right">ACCIONES</th>
							</tr>
						</thead>
						<tbody>
							{recentDeliveries.map((row, i) => {
								const chip = statusChip[row.status] || statusChip['Entregado']
								return (
									<tr key={i}>
										<td className="cell-id">{row.id}</td>
										<td>{row.destino}</td>
										<td className="cell-time">{row.time}</td>
										<td><span className="dd-status-chip" style={{ background: chip.bg, color: chip.color }}>{chip.label}</span></td>
										<td className="td-right">
											<button className="dd-btn-eye" aria-label={`Ver detalle de envío ${row.id}`}>
												<svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
											</button>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
