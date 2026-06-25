import './index.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Header } from './components/Header.jsx'
import { FormLoadPackage } from './components/FormLoadPackage.jsx'
import { Delivery } from './components/Delivery.jsx'

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
      <Header />
      {<FormLoadPackage packages={packages} setPackages={setPackages}/> /* Hacer link a Cargar Paquetes en el Header */} 
      {/*<Delivery packages={packages}/> /* Hacer link a Envios en el Header */}
    </>
  )
}

export default App
