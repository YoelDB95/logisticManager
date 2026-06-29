import './index.css'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { Header } from './components/Header.jsx'
import { FormLoadPackage } from './components/FormLoadPackage.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { Delivery } from './components/Delivery.jsx'
import { DriverDashboard } from './components/DriverDashboard.jsx'
import { SkipLink } from './components/SkipLink.jsx'

function App() {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/addresses').then(res => {
      if (res.data.length > 0) {
          setPackages(res.data)
      }
    })
  }, [])

  return (
    <>
      <SkipLink />
      <Header />
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<DriverDashboard packages={packages} />} />
          <Route path="/admin" element={<Dashboard packages={packages} />} />
          <Route path="/envios" element={<Delivery packages={packages} />} />
          <Route path="/cargar" element={<FormLoadPackage setPackages={setPackages} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
