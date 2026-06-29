import { Helmet } from 'react-helmet-async'
import { useState } from "react"
import { Pagination } from "./Pagination"
import './Delivery.css'

export const Delivery = ({ packages}) => {
    const [filters, setFilters] = useState({packageStatus: '', date: '', consignee: ''})
    const [page, setPage] = useState(0)
    const totalRows = 4

    const minIndex = page * totalRows
    const maxIndex = page * totalRows + totalRows

    const handlePage = (page) => {
        setPage(page)
    }

    const filteredPackages = packages.filter(_package => {
        let inputDate
        let backendDate
        if (filters.date) {
            backendDate = new Date(_package.dateCreatedAt)
            const [y, m, d] = filters.date.split('-').map(Number)
            inputDate = new Date(y, m - 1, d)
        }

        const byDate = !filters.date || backendDate.getFullYear() === inputDate.getFullYear() &&
            backendDate.getMonth() === inputDate.getMonth() &&
            backendDate.getDate() === inputDate.getDate()
        
        const byStatus = !filters.packageStatus ||
            _package?.packages[0]?.status === filters.packageStatus ||
            filters.packageStatus === 'estado-paquete'
        
        const byConsginee = !filters.consignee || _package.name.includes(filters.consignee)
        
        if (byConsginee && byDate && byStatus) return _package
    })

    const data = (_packages) => {
        return _packages.slice(minIndex, maxIndex).map((_package, i) => {
            const packageClass = _package?.packages[0]?.status === 'En ruta' ? "badge-green" : ""
            return (
                <tr key={i}>
                    <td className="bold">{_package?.name || ''}</td>
                    <td className="td-muted">{_package.address + ', ' + _package?.city || ''}</td>
                    <td><span className={"badge " + packageClass}>{_package?.packages[0]?.status || ''}</span></td>
                    <td className="td-muted">{new Date(_package?.dateCreatedAt).toLocaleDateString('es-AR') || ''}</td>
                    <td className="td-actions"><button className="btn-link">Ver detalle</button></td> 
                </tr>
            )
        })
    }
    
    return (
        <>
            <Helmet>
                <title>Envíos — Logistic Manager</title>
                <meta name="description" content="Gestión de paquetes activos con filtros por estado, fecha y destinatario. Seguimiento de envíos en tiempo real." />
                <meta property="og:title" content="Envíos — Logistic Manager" />
                <meta property="og:description" content="Gestión de paquetes activos con filtros por estado, fecha y destinatario." />
                <meta name="twitter:title" content="Envíos — Logistic Manager" />
                <meta name="twitter:description" content="Gestión de paquetes activos con filtros por estado, fecha y destinatario." />
            </Helmet>
            <div className="dashboard-container">
            <header className="main-header">
                <div className="main-title-group">
                    <p className="main-title">Panel de Gestión de Paquetes</p>
                    <p className="main-subtitle">
                        Gestiona todos los paquetes activos en un solo lugar.
                    </p>
                </div>
            </header>

            <main className="main-dash">
                <section className="filters" aria-label="Filtros de búsqueda">
                    <label htmlFor="filter-status" className="visually-hidden">Estado del paquete</label>
                    <select
                        id="filter-status"
                        name="estado"
                        onChange={e => {setFilters({...filters, packageStatus: e.target.value}); setPage(0)}}
                        className="filter-btn"
                    >
                        <option value='estado-paquete'>Estado Del Paquete</option>
                        <option value='not delivered'>No Entregado</option>
                        <option value='En ruta'>En Ruta</option>
                        <option value='Entregado'>Entregado</option>
                    </select>
                    <label htmlFor="filter-date" className="visually-hidden">Filtrar por fecha</label>
                    <input
                        id="filter-date"
                        type="date"
                        onChange={e => {setFilters({...filters, date: e.target.value}); setPage(0)}}
                        name="fecha"
                        className="filter-btn"
                    />
                    <div className="filter-search">
                        <label htmlFor="filter-search-input" className="visually-hidden">Buscar por destinatario o ID</label>
						<input
                            id="filter-search-input"
                            type="text"
                            onChange={e => {setFilters({...filters, consignee: e.target.value}); setPage(0)}}
                            placeholder="Buscar por Destinatario o ID"
                        />
					</div>
                </section>

                <section className="table-container" aria-label="Listado de paquetes">
                    <div className="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Destinatario</th>
                                    <th scope="col">Destino</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Fecha de Carga</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data(packages)}
                            </tbody>
                        </table>
                    </div>
                </section>
                
                <Pagination handlePage={handlePage} page={page} totalRows={totalRows} packages={filteredPackages}/>
            </main>
        </div>
        </>
    )
}
