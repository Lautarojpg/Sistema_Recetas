import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { buscarReceta } from "../services/api";

function SearchBar( {alBuscar}) {
  const [busqueda, setBusqueda] = useState("");

  const presionarBuscar = async (evento) => {
  evento.preventDefault();

  const results = await buscarReceta(busqueda);
  alBuscar(results, busqueda);
};

  return (
    <form onSubmit={presionarBuscar} className="search-form">
      <input
        type="text"
        placeholder="Buscar recetas..."
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        <SearchIcon size={20} />
      </button>
    </form>
  );
}

export default SearchBar;