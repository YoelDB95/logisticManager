import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { updatePackageStatus } from '../services/packageService.js'
import './AddressDetail.css'

const statusCfg = {
  'En ruta':       { color: '#38bdf8', label: 'EN RUTA' },
  'Entregado':     { color: '#10b981', label: 'ENTREGADO' },
  'not delivered': { color: '#f1a02b', label: 'PENDIENTE' },
  'Incidente':     { color: '#ffb4ab', label: 'INCIDENTE' },
}

export const AddressDetail = ({ packages }) => {
  const { addressId } = useParams()
  const navigate = useNavigate()

  const address = packages.find(p => p.address === addressId)
  const [pkgList, setPkgList] = useState(() => address?.packages || [])
  const [updating, setUpdating] = useState(null)

  if (!address) {
    return (
      <div className="detail-page">
        <div className="detail-empty">
          <h2>Dirección no encontrada</h2>
          <p>La dirección solicitada no existe o ha sido eliminada.</p>
          <Link to="/envios" className="btn-primary">Volver a Envíos</Link>
        </div>
      </div>
    )
  }

  const status = pkgList[0]?.status || 'not delivered'
  const cfg = statusCfg[status] || { color: '#87929a', label: status }

  const handleDeliverAll = async () => {
    setUpdating('all')
    const prev = [...pkgList]

    setPkgList(prevList => prevList.map(p => ({ ...p, status: 'Entregado' })))

    try {
      await Promise.all(prev.map((pkg, i) =>
        updatePackageStatus(addressId, pkg.id || i, 'Entregado')
      ))
    } catch {
      setPkgList(prev)
    } finally {
      setUpdating(null)
    }
  }

  const handleSetStatus = async (index, newStatus) => {
    setUpdating(index)
    const pkg = pkgList[index]
    const prev = [...pkgList]

    setPkgList(prevList => {
      const updated = [...prevList]
      updated[index] = { ...updated[index], status: newStatus }
      return updated
    })

    try {
      await updatePackageStatus(addressId, pkg.id || index, newStatus)
    } catch {
      setPkgList(prev)
    } finally {
      setUpdating(null)
    }
  }

  const allDelivered = pkgList.length > 0 && pkgList.every(p => p.status === 'Entregado')

  return (
    <>
      <Helmet>
        <title>{address.address} — Logistic Manager</title>
        <meta name="description" content={`Detalle de dirección: ${address.address}, ${address.city}. Paquetes asociados a ${address.name}.`} />
      </Helmet>
      <div className="detail-page">
        <button className="detail-back" onClick={() => navigate(-1)}>
          <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Volver
        </button>

        <section className="detail-header" aria-label="Información de la dirección">
          <div className="detail-header-top">
            <div>
              <h1 className="detail-title">{address.address}</h1>
              <p className="detail-subtitle">{address.city}</p>
            </div>
            <span className="status-chip" style={{ background: `${cfg.color}1a`, color: cfg.color }}>{cfg.label}</span>
          </div>
          <div className="detail-meta">
            <div className="detail-meta-item">
              <span className="detail-meta-label">Destinatario</span>
              <span className="detail-meta-value">{address.name}</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-label">Paquetes</span>
              <span className="detail-meta-value">{pkgList.length}</span>
            </div>
            {address.dateCreatedAt && (
              <div className="detail-meta-item">
                <span className="detail-meta-label">Fecha de carga</span>
                <span className="detail-meta-value">{new Date(address.dateCreatedAt).toLocaleDateString('es-AR')}</span>
              </div>
            )}
          </div>
        </section>

        <section className="detail-packages" aria-label="Paquetes de esta dirección">
          <div className="detail-section-top">
            <h2 className="detail-section-title">Paquetes ({pkgList.length})</h2>
            <div className="detail-actions">
              {!allDelivered && (
                <button
                  className="btn-action btn-deliver"
                  onClick={handleDeliverAll}
                  disabled={updating === 'all'}
                >
                  {updating === 'all' ? 'ACTUALIZANDO…' : 'ENTREGAR TODO'}
                </button>
              )}
            </div>
          </div>

          {pkgList.length === 0 ? (
            <div className="detail-empty-table">
              <p>No hay paquetes registrados para esta dirección.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Contenido</th>
                      <th scope="col">Peso</th>
                      <th scope="col">Dimensiones</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pkgList.map((pkg, i) => {
                      const s = statusCfg[pkg.status] || { color: '#87929a', label: pkg.status || 'PENDIENTE' }
                      const isEntregado = pkg.status === 'Entregado'
                      return (
                        <tr key={i}>
                          <td className="cell-id">{pkg.id || `#${String(i + 1).padStart(4, '0')}`}</td>
                          <td>{pkg.content || '—'}</td>
                          <td className="td-muted">{pkg.weight ? `${pkg.weight} kg` : '—'}</td>
                          <td className="td-muted">{pkg.dimension || '—'}</td>
                          <td><span className="status-chip" style={{ background: `${s.color}1a`, color: s.color }}>{s.label}</span></td>
                          <td className="td-actions">
                            {!isEntregado ? (
                              <div className="row-actions">
                                <button
                                  className="btn-row btn-deliver-row"
                                  onClick={() => handleSetStatus(i, 'Entregado')}
                                  disabled={updating === i}
                                  title="Marcar como entregado"
                                >
                                  <svg fill="currentColor" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                                </button>
                                <button
                                  className="btn-row btn-incident-row"
                                  onClick={() => handleSetStatus(i, 'Incidente')}
                                  disabled={updating === i}
                                  title="Marcar como no entregable"
                                >
                                  <svg fill="currentColor" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                </button>
                              </div>
                            ) : (
                              <span className="td-check"><svg fill="#10b981" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg></span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
