import './Pagination.css'

export const Pagination = ({handlePage, page, packages, totalRows}) => {
    if (packages.length === 0) return
    
    const handlePrevious = () => {        
        if (page > 0)
            handlePage(page - 1)
    }
    const totalPages = Math.ceil(packages.length / totalRows)

    const handleNext = () => {    
        if (page < totalPages - 1)
            handlePage(page + 1)
    
    }

    const minIndex = totalRows * page + 1
    const maxIndex = totalRows * page + totalRows < packages.length ? totalRows * page + totalRows : packages.length

    return (
        <section className="pagination">
            <p>Mostrando {minIndex} a {maxIndex} de {packages.length} resultados</p>
            <div className="btn-pag">
                <button className="btn-pagination" onClick={handlePrevious}>Anterior</button>
                <button className="btn-pagination" onClick={handleNext}>Siguiente</button>
            </div>
        </section>
    )
}