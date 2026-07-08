import { Helmet } from 'react-helmet-async'
import axios from "axios"
import { useState, Component } from "react"
import MLScannerCrop from "./MLScannerCrop.jsx"
import './FormLoadPackage.css'

class ScannerErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="scanner-error">
          <p>No se pudo cargar el escáner.</p>
          <p className="scanner-error-hint">Verifica que tu cámara esté disponible y los permisos concedidos.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export const FormLoadPackage = ({ setPackages }) => {
  const [data, setData] = useState({name: '', address: '', barcode: '', content: '', weight: '', dimension: '', city: ''})
  const [showScanner, setShowScanner] = useState(false)
  const [errors, setErrors] = useState({})
  
  const enable = data.name.length > 0 && data.address.length > 0 && data.barcode.length > 0

  const validate = () => {
    const errs = {}
    if (!data.name.trim()) errs.name = 'El nombre del destinatario es obligatorio'
    if (!data.address.trim()) errs.address = 'La dirección es obligatoria'
    if (!data.barcode.trim()) errs.barcode = 'El código de barras es obligatorio'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmitHandle = (e) => {
    e.preventDefault()
    if (!validate()) return
    
    const { address, name, city } = data
    
    axios
      .post('http://localhost:3001/api/addresses', {address, name, city})
      .then(res => setPackages(prev => [...prev, res.data]))
      .catch(e => console.log(e.response.data))
    
      setData({name: '', address: '', barcode: '', content: '', weight: '', dimension: '', city: ''})
      setErrors({})
  }

  const handleScanner = () => {
    setShowScanner(true)
  }

  const handleCloseScanner = () => {
    setShowScanner(false)
  }

  const handleScanResult = ({ barcode, ocrText }) => {
    const parsed = parseOcrData(ocrText)
    setData(prev => ({
      ...prev,
      barcode: barcode || prev.barcode,
      ...parsed,
    }))
  }

  const parseOcrData = (text) => {
    if (!text) return {}
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const result = {}

    const allText = lines.join(' ')

    const nameMatch = allText.match(/([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)\s*\(/);
    if (nameMatch) {
      result.name = nameMatch[1].trim()
    }

    lines.forEach(line => {
      const lower = line.toLowerCase()
      if (lower.includes('domicilio') || lower.includes('direccion') || lower.includes('dirección') || lower.includes('address')) {
        result.address = line.replace(/^(domicilio|direccion|dirección|address)[:\s]*/i, '').trim()
      } else if (lower.includes('ciudad') || lower.includes('destino') || lower.includes('city')) {
        result.city = line.replace(/^(ciudad|city)[:\s]*/i, '').trim()
      } else if (lower.includes('peso') || lower.includes('weight')) {
        result.weight = line.replace(/^(peso|weight)[:\s]*/i, '').trim()
      } else if (lower.includes('dimension') || lower.includes('dimensiones')) {
        result.dimension = line.replace(/^(dimension|dimensiones)[:\s]*/i, '').trim()
      } else if (lower.includes('referencia') || lower.includes('reference')) {
        result.content = line.replace(/^(referencia|reference)[:\s]*/i, '').trim()
      } else if (lower.includes('contenido') || lower.includes('content')) {
        result.content = line.replace(/^(contenido|content)[:\s]*/i, '').trim()
      }
    })
    return result
  }

  const setField = (field, value) => {
    setData({...data, [field]: value})
    if (errors[field]) {
      setErrors({...errors, [field]: ''})
    }
  }

  return (
        <>
            <Helmet>
                <title>Cargar Paquete — Logistic Manager</title>
                <meta name="description" content="Registre un nuevo paquete en el sistema. Complete información del destinatario, detalles del paquete y escanee códigos de barras." />
                <meta property="og:title" content="Cargar Paquete — Logistic Manager" />
                <meta property="og:description" content="Registre un nuevo paquete en el sistema con escaneo de códigos de barras." />
                <meta name="twitter:title" content="Cargar Paquete — Logistic Manager" />
                <meta name="twitter:description" content="Registre un nuevo paquete en el sistema con escaneo de códigos de barras." />
            </Helmet>
        <main>
        <div className="form-page">
          <div className="page-header">
            <div>
              <h1 className="dashboard-title">Cargar Nuevo Paquete</h1>
              <p className="dashboard-subtitle">
                Complete la información a continuación para registrar un nuevo
                paquete en el sistema.
              </p>
            </div>
          </div>

        <form className="form-card" onSubmit={onSubmitHandle} noValidate>
          <section aria-label="Información del destinatario">
            <h2 className='section-title'>Informacion del destinatario</h2>
            <div className='line'></div>
            <div className='grid-2'>
              <label className='field'>
                <span className='field-label'>Nombre Completo</span>
                <input
                  type='text'
                  onChange={e => setField('name', e.target.value)}
                  value={data.name}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  required
                />
                {errors.name && <span id="error-name" className="field-error" role="alert">{errors.name}</span>}
              </label>
              <label className='field'>
                <span className='field-label'>Ciudad de destino</span>
                <input type='text' onChange={e => setField('city', e.target.value)} value={data.city}></input>
              </label>
              <label className='field full'>
                <span className='field-label'>Direccion Completa</span>
                <input
                  type='text'
                  onChange={e => setField('address', e.target.value)}
                  value={data.address}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? 'error-address' : undefined}
                  required
                />
                {errors.address && <span id="error-address" className="field-error" role="alert">{errors.address}</span>}
              </label>
            </div>
          </section>

          <section aria-label="Detalles del paquete">
            <h2 className='section-title'>Detalles del Paquete</h2>
            <div className='grid-2'>
              <label className='field full'>
                <span className='field-label'>Codigo de Barras</span>
                <input
                  type='text'
                  onChange={e => setField('barcode', e.target.value)}
                  value={data.barcode}
                  aria-invalid={!!errors.barcode}
                  aria-describedby={errors.barcode ? 'error-barcode' : undefined}
                  required
                />
                {errors.barcode && <span id="error-barcode" className="field-error" role="alert">{errors.barcode}</span>}
              </label>
              <label className='field full'>
                <span className='field-label'>Contenido del Paquete</span>
                <textarea onChange={e => setField('content', e.target.value)} value={data.content}></textarea>
              </label>
              <label className='field'>
                <span className='field-label'>Peso (kg)</span>
                <input type='text' onChange={e => setField('weight', e.target.value)} value={data.weight}></input>
              </label>
              <label className='field'>
                <span className='field-label'>Dimensiones (cm³)</span>
                <input type='text' onChange={e => setField('dimension', e.target.value)} value={data.dimension}></input>
              </label>
            </div>
          </section>

          <div className='form-actions'>
            <button type='button' className='btn-outline'>Cancelar</button>
            <button type='submit' disabled={!enable} className='btn-primary' aria-disabled={!enable}>Guardar Paquete</button>
          </div>
        </form>

        <section className="scan-section" aria-label="Escaneo de etiqueta">
            <p className="scan-hint">
              Escanee la etiqueta para rellenar automáticamente los detalles del paquete.
            </p>
            <button type="button" onClick={handleScanner} className="scan-btn">
              Escanear Etiqueta de Paquete
            </button>
          </section>

        {showScanner && (
          <div className="modal-overlay" onClick={handleCloseScanner} role="dialog" aria-modal="true" aria-label="Escáner de código de barras">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseScanner} aria-label="Cerrar escáner">&times;</button>
              <ScannerErrorBoundary><MLScannerCrop onScan={handleScanResult} /></ScannerErrorBoundary>
            </div>
          </div>
        )}
      </div>
      </main>
      </>
    )
} 
