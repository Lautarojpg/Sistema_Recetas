import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Searcher from './components/Searcher'
import SearchResults from './components/SearchResults'

import { Routes, Route } from "react-router-dom";
import RecipePage from "./pages/RecipePage";

function App() {
  const [query, setQuery] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [user, setUser] = useState(null)
  const [userRecipes, setUserRecipes] = useState([]);

  //  Persistencia de sesión

  useEffect(() => {
  const session = JSON.parse(localStorage.getItem("session"));
  if (session) setUser(session);
}, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("session", JSON.stringify(user));
    } else {
      localStorage.removeItem("session");
    }
  }, [user]);

  // Traer recetas destacadas

  useEffect(() => {
  const fetchFeatured = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/recetas/destacadas");

      if (!res.ok) throw new Error("Error en API");

      const data = await res.json();
      setFeatured(data);

    } catch (err) {
      console.error(err);
    }
  };

  fetchFeatured();
}, []);


  const handleSearch = (results, searchQuery) => {
    setRecetas(results);
    setQuery(searchQuery);
  };

 const fetchUserRecipes = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/recetas/usuario/${userId}`);
      const data = await res.json();
      setUserRecipes(data);
    } catch (error) {
      console.error("Error trayendo recetas del usuario:", error);
    }
  };

  useEffect(() => {
  const id = user?.id_usuario;
  if (!id) return;

  fetchUserRecipes(id);
}, [user?.id_usuario]);


  return (
    <>
      <Header onLogin={setUser} user={user} />

      <Routes>
        <Route path="/" element={
          <>
          <Searcher onSearch={handleSearch}  />
          <SearchResults results={recetas} query={query} featured={featured} userRecipes={userRecipes} user={user}/>
          </>
        }
        />

        <Route path="/receta/:id" element={<RecipePage user={user} />} />
      </Routes>
      
      <Footer />
    </>
  )
}

export default App