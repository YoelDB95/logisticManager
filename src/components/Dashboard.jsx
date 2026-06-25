import { useState } from "react"
import { Pagination } from "./Pagination"
import './Dashboard.css'

export const Dashboard = ({ packages }) => {
    const [page, setPage] = useState(0)
    const totalRows = 4

    const minIndex = page * totalRows
    const maxIndex = page * totalRows + totalRows

    const handlePage = (page) => {
        setPage(page)
    }

    const enRuta = packages.filter(p => p?.packages?.[0]?.status === 'En ruta').length
    const entregados = packages.filter(p => p?.packages?.[0]?.status === 'Entregado').length
    const pendientes = packages.filter(p => !p?.packages?.[0]?.status || p.packages[0].status === 'not delivered').length

    const data = (_packages) => {
        return _packages.slice(minIndex, maxIndex).map((_package, i) => {
            const packageClass = _package?.packages?.[0]?.status === 'En ruta' ? "badge-green" : ""
            return (
                <tr key={i}>
                    <td className="bold">{_package?.name || ''}</td>
                    <td className="td-muted">{(_package.address || '') + ', ' + (_package?.city || '')}</td>
                    <td><span className={"badge " + packageClass}>{_package?.packages?.[0]?.status || 'Pendiente'}</span></td>
                    <td className="td-muted">{_package?.dateCreatedAt ? new Date(_package.dateCreatedAt).toLocaleDateString('es-AR') : ''}</td>
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
                    <p className="main-subtitle">Resumen general del sistema de paquetes.</p>
                </div>
            </header>

            <section className="summary-cards">
                <div className="summary-card">
                    <span className="summary-number">{packages.length}</span>
                    <span className="summary-label">Total</span>
                </div>
                <div className="summary-card card-enruta">
                    <span className="summary-number">{enRuta}</span>
                    <span className="summary-label">En Ruta</span>
                </div>
                <div className="summary-card card-entregado">
                    <span className="summary-number">{entregados}</span>
                    <span className="summary-label">Entregados</span>
                </div>
                <div className="summary-card card-pendiente">
                    <span className="summary-number">{pendientes}</span>
                    <span className="summary-label">Pendientes</span>
                </div>
            </section>

            <main className="main-dash">
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

                <Pagination handlePage={handlePage} page={page} totalRows={totalRows} packages={packages} />
            </main>
        </div>
    )
}
