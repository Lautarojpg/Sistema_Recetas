import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Searcher from './components/Searcher'
import SearchResults from './components/SearchResults'

function App() {
  const [query, setQuery] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [user, setUser] = useState(null)
  const [userRecipes, setUserRecipes] = useState([]);

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


  const handleSearch = (results, searchQuery) => {
    setRecetas(results);
    setQuery(searchQuery);
  };

 const fetchUserRecipes = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/recetas/usuario/${userId}`);
      console.log("STATUS:", res.status);
      console.log("CONTENT-TYPE:", res.headers.get("content-type"));
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
      <Searcher onSearch={handleSearch}  />
      <SearchResults results={recetas} query={query} featured={featured} userRecipes={userRecipes} user={user}/>
      <Footer />


    </>
  )
}

export default App