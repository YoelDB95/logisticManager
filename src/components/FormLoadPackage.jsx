import axios from "axios"
import { useState } from "react"
import MLScannerCrop from "./MLScannerCrop.jsx"
import './FormLoadPackage.css'

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

  const handleScanner = (e) => {
    e.preventDefault()
    setShowScanner(true)
  }

  const handleCloseScanner = () => {
    setShowScanner(false)
  }

  const setField = (field, value) => {
    setData({...data, [field]: value})
    if (errors[field]) {
      setErrors({...errors, [field]: ''})
    }
  }

  return (
        <main>
        <div>
          <div>
            <h1 className="page-title">Cargar Nuevo Paquete</h1>
            <p>
              Complete la información a continuación para registrar un nuevo
              paquete en el sistema.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmitHandle} noValidate>
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

          <section className="scan-section" aria-label="Escaneo de etiqueta">
            <p className="scan-hint">
              Escanee la etiqueta para rellenar automáticamente los detalles del paquete.
            </p>
            <button type="button" onClick={handleScanner} className="scan-btn">
              Escanear Etiqueta de Paquete
            </button>
          </section>

          <div className='form-actions'>
            <button type='button' className='btn-cancel'>Cancelar</button>
            <button type='submit' disabled={!enable} className='btn-submit' aria-disabled={!enable}>Guardar Paquete</button>
          </div>
        </form>

        {showScanner && (
          <div className="modal-overlay" onClick={handleCloseScanner} role="dialog" aria-modal="true" aria-label="Escáner de código de barras">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseScanner} aria-label="Cerrar escáner">&times;</button>
              <MLScannerCrop />
            </div>
          </div>
        )}
      </main>
    )
} 
