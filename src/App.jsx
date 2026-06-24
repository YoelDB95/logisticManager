import './index.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Header } from './components/Header.jsx'
import { FormLoadPackage } from './components/FormLoadPackage.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import MLScanner from './components/MLScanner.jsx'
import OCRCamera from './components/OCRCamera.jsx'
import MLScannerCrop from './components/MLScannerCrop.jsx'

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
      {/*<FormLoadPackage packages={packages} setPackages={setPackages}/>*/}
      {/*<Dashboard packages={packages}/>*/}
      {<MLScannerCrop />}
    </>
  )
}

export default App
