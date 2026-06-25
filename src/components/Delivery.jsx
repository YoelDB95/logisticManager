import { useState } from "react"
import { Pagination } from "./Pagination"
import './Delivery.css'

export const Delivery = ({ packages}) => {
    const [filters, setFilters] = useState({packageStatus: '', date: '', consignee: ''})
    const [page, setPage] = useState(0)
    const totalRows = 4
    console.log('page: ', page + 1);

    const minIndex = page * totalRows
    const maxIndex = page * totalRows + totalRows

    const handlePage = (page) => {
        setPage(page)
    }

    const filteredPackages = packages.filter(_package => {
        let inputDate
        let backendDate
        if (filters.date) {
            backendDate = new Date(_package.dateCreatedAt) // ISO del backend
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
                <section className="filters">
                    <select
                        name="estado"
                        onChange={e => {setFilters({...filters, packageStatus: e.target.value}); setPage(0)}}
                        className="filter-btn"
                    >
                        <option value='estado-paquete'>Estado Del Paquete</option>
                        <option value='not delivered'>No Entregado</option>
                        <option value='En ruta'>En Ruta</option>
                        <option value='Entregado'>Entregado</option>
                    </select>
                    <input
                        type="date"
                        onChange={e => {setFilters({...filters, date: e.target.value}); setPage(0)}}
                        name="fecha"
                        className="filter-btn"
                    ></input>
                    <div className="filter-search">
						<input
                            type="text"
                            onChange={e => {setFilters({...filters, consignee: e.target.value}); setPage(0)}}
                            placeholder="Buscar por Destinatario o ID"
                        />
					</div>
                </section>

                <section className="table-container">
                    <div className="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Destinatario</th>
                                    <th>Destino</th>
                                    <th>Estado</th>
                                    <th>Fecha de Carga</th>
                                    <th></th>
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
    )
}