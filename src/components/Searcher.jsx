import SearchBar from "./SearchBar"

function Searcher() {
    return (
        <section id="searcher-container">
        <div className="searcher-content">
            <div className="searcher-text">
                <h1>Encuentra tu próxima receta favorita</h1>
                <p>
                Busca tus ingredientes, elige tu tipo de comida o simplemente explora nuestras recetas destacadas. ¡Cocinar nunca ha sido tan fácil y delicioso!
                </p>
            </div>
          <SearchBar />
        </div>
        
        
      </section>
    )
}

export default Searcher