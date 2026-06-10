import Searcher from "../components/Searcher";
import SearchResults from "../components/SearchResults";
import { useDestacadas, useRecetasUsuario} from "../services/hooks"
import { useState } from 'react';

export default function Home({ user }) {
    const [recetas, setRecetas] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const destacadas = useDestacadas();
    const usuarioRecetas = useRecetasUsuario(user);

    const alBuscar = (results, buscarBusqueda) => {
      setRecetas(results);
      setBusqueda(buscarBusqueda);
    };

  return (
    <>
    <Searcher alBuscar={alBuscar}  />
    <SearchResults results={recetas} busqueda={busqueda} destacadas={destacadas} usuarioRecetas={usuarioRecetas} user={user}/>
    </>
  )
}