import { useState } from "react";
import { SearchIcon } from "lucide-react";

function SearchBar( {onSearch}) {
  const [search, setSearch] = useState("");

  const buscarReceta = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch(`http://localhost:3000/api/recetas?q=${search}`);
    const results = await response.json();
    onSearch(results, search);
    } catch (error) {
      console.error("Error al buscar recetas:", error);
    }
  };

  return (
    <form onSubmit={buscarReceta} className="search-form">
      <input
        type="text"
        placeholder="Buscar recetas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        <SearchIcon size={20} />
      </button>
    </form>
  );
}

export default SearchBar;