import RecipeCard from "./RecipeCard";

function SearchResults({ results, query, featured, userRecipes, user }) {
  console.log('query:', query);
  const hasQuery = query && query.trim() !== "";
  const hasResults = results && results.length > 0;
  const isLoggedIn = user !== null;

  return (
    <div className="search-results">
      
      {hasQuery ? (
        hasResults ? (
          <>
            {results.length === 1 ? (
              <p>1 resultado encontrado para "{query}"</p>
            ) : (
              <p>{results.length} resultados encontrados para "{query}"</p>
            )}
            <ul className="results-grid">
                {results.map((recipe) => (
                    <RecipeCard key={recipe.id_receta} recipe={recipe} />
                ))}
            </ul>
          </>
        ) : (
          isLoggedIn ? (
          <>
            <p>No se encontraron resultados para "{query}"</p>

            <h3>Tus recetas</h3>
            <ul className="results-grid">
                {userRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id_receta} recipe={recipe} />
                ))}
            </ul>
          </>
          ) : (
            <>
              <p>No se encontraron resultados para "{query}"</p>
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