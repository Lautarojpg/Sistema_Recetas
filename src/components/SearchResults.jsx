import RecipeCard from "./RecipeCard";

function SearchResults({ results, query, featured }) {
  const hasQuery = query && query.trim() !== "";
  const hasResults = results && results.length > 0;

  return (
    <div className="search-results">
      
      {hasQuery ? (
        hasResults ? (
          <>
            <p>
              Se encontraron {results.length} resultados para "{query}"
            </p>

            <ul className="results-grid">
                {results.map((item, index) => (
                    <RecipeCard key={item.id} recipe={item} />
                ))}
            </ul>
          </>
        ) : (
          <>
            <p>No se encontraron resultados para "{query}"</p>

            <h3>Recetas destacadas</h3>
            <ul className="results-grid">
                {featured.map((item, index) => (
                    <RecipeCard key={item.id} recipe={item} />
                ))}
            </ul>
          </>
        )
      ) : (
        <>
          <h3>Recetas destacadas</h3>
          <ul className="results-grid">
            {featured.map((item, index) => (
              <RecipeCard key={item.id} recipe={item} />
            ))}
          </ul>
        </>
      )}

    </div>
  );
}

export default SearchResults;