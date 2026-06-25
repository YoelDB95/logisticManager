import axios from "axios"
import { useState } from "react"
import MLScannerCrop from "./MLScannerCrop.jsx"
import './FormLoadPackage.css'

export const FormLoadPackage = ({ packages, setPackages }) => {
  const [data, setData] = useState({name: '', address: '', barcode: '', content: '', weight: '', dimension: '', city: ''})
  const [showScanner, setShowScanner] = useState(false)
  
  const enable = data.name.length > 0 && data.address.length > 0 && data.barcode.length > 0

  const onSubmitHandle = (e) => {
    e.preventDefault()
    // guardar en el backend
    
    const { address, name, city } = data
    
    axios
      .post('http://localhost:3001/api/addresses', {address, name, city})
      .then(res => setData(packages.concat(res.data)))
      .catch(e => console.log(e.response.data))
    
      setData({name: '', address: '', barcode: '', content: '', weight: '', dimension: '', city: ''})
  }

  const handleScanner = (e) => {
    e.preventDefault()
    setShowScanner(true)
  }

  const handleCloseScanner = () => {
    setShowScanner(false)
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

        <form onSubmit={onSubmitHandle}>
          <section>
            <h2 className='section-title'>Informacion del destinatario</h2>
            <div className='line'></div>
            <div className='grid-2'>
              <label className='field'>
                <span className='field-label'>Nombre Completo</span>
                <input type='text' onChange={e => setData({...data, name: e.target.value})} value={data.name}></input>
              </label>
              <label className='field'>
                <span className='field-label'>Ciudad de destino</span>
                <input type='text' onChange={e => setData({...data, city: e.target.value})} value={data.city}></input>
              </label>
              <label className='field full'>
                <span className='field-label'>Direccion Completa</span>
                <input type='text' onChange={e => setData({...data, address: e.target.value})} value={data.address}></input>
              </label>
            </div>
          </section>

          <section>
            <h2 className='section-title'>Detalles del Paquete</h2>
            <div className='grid-2'>
              <label className='field full'>
                <span className='field-label'>Codigo de Barras</span>
                <input type='text' onChange={e => setData({...data, barcode: e.target.value})} value={data.barcode}></input>
              </label>
              <label className='field full'>
                <span className='field-label'>Contenido del Paquete</span>
                <textarea onChange={e => setData({...data, content: e.target.value})} value={data.content}></textarea>
              </label>
              <label className='field'>
                <span className='field-label'>Peso (kg)</span>
                <input type='text' onChange={e => setData({...data, weight: e.target.value})} value={data.weight}></input>
              </label>
              <label className='field'>
                <span className='field-label'>Dimensiones (cm³)</span>
                <input type='text' onChange={e => setData({...data, dimension: e.target.value})} value={data.dimension}></input>
              </label>
            </div>
          </section>

          <section className="scan-section">
            <p className="scan-hint">
              Escanee la etiqueta para rellenar automáticamente los detalles del paquete.
            </p>
            <button type="button" onClick={handleScanner} className="scan-btn">
              Escanear Etiqueta de Paquete
            </button>
          </section>

          <div className='form-actions'>
            <button type='button' className='btn-cancel'>Cancelar</button>
            <button type='submit' disabled={!enable} className='btn-submit'>Guardar Paquete</button>
          </div>
        </form>

        {showScanner && (
          <div className="modal-overlay" onClick={handleCloseScanner}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseScanner}>&times;</button>
              <MLScannerCrop />
            </div>
          </div>
        )}
      </main>
    )
} 