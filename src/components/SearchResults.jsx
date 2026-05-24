import RecipeCard from "./RecipeCard";

function SearchResults({ results, busqueda, destacadas, usuarioRecetas, user }) {

  const existeBusqueda = busqueda && busqueda.trim() !== "";
  const existeResultados = results && results.length > 0;
  const existeSesionUsuario = user !== null;

  return (
    <div className="search-results">

      {existeBusqueda ? (
        existeResultados ? (
          <>
            <p>
              {results.length} resultado{results.length !== 1 && "s"} encontrado
              {results.length !== 1 && "s"} para "{busqueda}"
            </p>

            <ul className="results-grid">
              {results.map((recipe) => (
                <RecipeCard key={recipe.id_receta} recipe={recipe} />
              ))}
            </ul>
          </>
        ) : existeSesionUsuario ? (
          <>
            <p>No se encontraron resultados para "{busqueda}"</p>

            <h3>Tus recetas</h3>

            <ul className="results-grid">
              {(usuarioRecetas || []).map((recipe) => (
                <RecipeCard key={recipe.id_receta} recipe={recipe} />
              ))}
            </ul>
          </>
        ) : (
          <>
            <p>No se encontraron resultados para "{busqueda}"</p>

            <h3>Recetas destacadas</h3>

            <ul className="results-grid">
              {(destacadas || []).map((recipe) => (
                <RecipeCard key={recipe.id_receta} recipe={recipe} />
              ))}
            </ul>
          </>
        )
      ) : (
        <>
          <h3>Recetas destacadas</h3>

          <ul className="results-grid">
            {(destacadas || []).map((recipe) => (
              <RecipeCard key={recipe.id_receta} recipe={recipe} />
            ))}
          </ul>
        </>
      )}

    </div>
  );
}

export default SearchResults;