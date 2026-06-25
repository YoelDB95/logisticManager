import './Header.css'

export const Header = () => {
    return (
        <header className="header">
            <div>
                <a href='#' className='header-title'>LogisticsManager</a>
            </div>
            <nav>
                <a href='#'>Dashboard</a>
                <a href='#'>Envios</a>
                <a href='#'>Cargar Paquetes</a>
            </nav>
      </header>
    )
}