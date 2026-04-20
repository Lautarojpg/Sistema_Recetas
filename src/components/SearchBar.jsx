import { useState } from "react";
import { SearchIcon } from "lucide-react";

function SearchBar() {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", search);
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
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