import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="header">
            <div className="header-left">
                <NavLink to="/" className='header-title' end>LogisticsManager</NavLink>
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
            </button>
            <nav className={menuOpen ? 'open' : ''} aria-label="Navegación principal">
                <NavLink to="/" end onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>
                <NavLink to="/envios" onClick={() => setMenuOpen(false)}>Envios</NavLink>
                <NavLink to="/cargar" onClick={() => setMenuOpen(false)}>Cargar Paquetes</NavLink>
            </nav>
      </header>
    )
}
