import Searcher from "../components/Searcher";
import SearchResults from "../components/SearchResults";
import { buscarDestacadas } from '../services/api';
import { buscarRecetasUsuario } from '../services/api';
import { useState, useEffect } from 'react';

export default function Home({ user }) {
    const [featured, setFeatured] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [userRecipes, setUserRecipes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    // Actualiza recetas destacadas
    useEffect(() => {
    const fetchDestacadas = async () => {
        const data = await buscarDestacadas();
        setFeatured(data);
    };

    fetchDestacadas();
    }, []);

    // Actualiza recetas del usuario
    useEffect(() => {
    const fetchRecetasUsuario = async () => {
        if (!user) {
        setUserRecipes([]);
        return;
        }
        const data = await buscarRecetasUsuario(user);
        setUserRecipes(data);
    };

    fetchRecetasUsuario();
    }, [user]);

    const alBuscar = (results, buscarBusqueda) => {
      setRecetas(results);
      setBusqueda(buscarBusqueda);
    };

  return (
    <>
    <Searcher alBuscar={alBuscar}  />
    <SearchResults results={recetas} busqueda={busqueda} featured={featured} userRecipes={userRecipes} user={user}/>
    </>
  )
}