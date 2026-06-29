import { NavLink } from 'react-router-dom'
import './Header.css'

export const Header = () => {
    return (
        <header className="header">
            <div>
                <NavLink to="/" className='header-title' end>LogisticsManager</NavLink>
            </div>
            <nav aria-label="Navegación principal">
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/admin">Admin</NavLink>
                <NavLink to="/envios">Envios</NavLink>
                <NavLink to="/cargar">Cargar Paquetes</NavLink>
            </nav>
      </header>
    )
}
