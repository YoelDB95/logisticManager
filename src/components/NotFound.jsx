import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import './NotFound.css'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Página no encontrada — Logistic Manager</title>
        <meta name="description" content="La página que buscas no existe o ha sido movida." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="not-found">
        <span className="not-found-code" aria-hidden="true">404</span>
        <h1 className="not-found-title">Página no encontrada</h1>
        <p className="not-found-text">La página que buscas no existe o fue movida a otra dirección.</p>
        <div className="not-found-actions">
          <button className="btn-primary" onClick={() => navigate('/')}>
            <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            VOLVER AL INICIO
          </button>
          <button className="btn-outline" onClick={() => navigate(-1)}>
            <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            PÁGINA ANTERIOR
          </button>
        </div>
      </div>
    </>
  )
}