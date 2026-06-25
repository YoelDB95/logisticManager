import { NavLink } from 'react-router-dom'
import './Header.css'

export const Header = () => {
    return (
        <header className="header">
            <div>
                <NavLink to="/" className='header-title' end>LogisticsManager</NavLink>
            </div>
            <nav>
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/envios">Envios</NavLink>
                <NavLink to="/cargar">Cargar Paquetes</NavLink>
            </nav>
      </header>
    )
}
