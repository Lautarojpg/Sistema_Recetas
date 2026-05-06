import RecipeCard from "./RecipeCard";

function SearchResults({ results, busqueda, featured, userRecipes, user }) {
  console.log('busqueda:', busqueda);
  const existeCola = busqueda && busqueda.trim() !== "";
  const existeResultados = results && results.length > 0;
  const existeSesionUsuario = user !== null;

  return (
    <div className="search-results">
      
      {existeCola ? (
        existeResultados ? (
          <>
            {results.length === 1 ? (
              <p>1 resultado encontrado para "{busqueda}"</p>
            ) : (
              <p>{results.length} resultados encontrados para "{busqueda}"</p>
            )}
            <ul className="results-grid">
                {results.map((recipe) => (
                    <RecipeCard key={recipe.id_receta} recipe={recipe} />
                ))}
            </ul>
          </>
        ) : (
          existeSesionUsuario ? (
          <>
            <p>No se encontraron resultados para "{busqueda}"</p>

            <h3>Tus recetas</h3>
            <ul className="results-grid">
                {userRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id_receta} recipe={recipe} />
                ))}
            </ul>
          </>
          ) : (
            <>
              <p>No se encontraron resultados para "{busqueda}"</p>
              <h3>Recetas destacadas</h3>
              <ul className="results-grid">
                {featured.map((recipe) => (
                  <RecipeCard key={recipe.id_receta} recipe={recipe} />
                ))}
              </ul>
        </>
          )
        )
      ) : (
        <>
          <h3>Recetas destacadas</h3>
          <ul className="results-grid">
            {featured.map((recipe) => (
              <RecipeCard key={recipe.id_receta} recipe={recipe} />
            ))}
          </ul>
        </>
      )}

    </div>
  );
}

export default SearchResults;