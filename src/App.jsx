import './index.css'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Header } from './components/Header.jsx'
import { getPackages } from './services/packageService.js'
import { FormLoadPackage } from './components/FormLoadPackage.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { Delivery } from './components/Delivery.jsx'
import { DriverDashboard } from './components/DriverDashboard.jsx'
import { NotFound } from './components/NotFound.jsx'
import { SkipLink } from './components/SkipLink.jsx'
import { AddressDetail } from './components/AddressDetail.jsx'

function App() {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    getPackages().then(data => {
      if (data.length > 0) {
        setPackages(data)
      }
    })
  }, [])

  return (
    <>
      <Helmet>
        <html lang="es" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <SkipLink />
      <Header />
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<DriverDashboard packages={packages} />} />
          <Route path="/admin" element={<Dashboard packages={packages} />} />
          <Route path="/envios" element={<Delivery packages={packages} />} />
          <Route path="/cargar" element={<FormLoadPackage setPackages={setPackages} />} />
          <Route path="/direccion/:addressId" element={<AddressDetail packages={packages} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
