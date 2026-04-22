import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Searcher from './components/Searcher'
import SearchResults from './components/SearchResults'

function App() {
  const [query, setQuery] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [featured, setFeatured] = useState([]);

  const [user, setUser] = useState(null)
  // 🔥 filtrar recetas según usuario
{*/ recetasFiltradas = user
    ? recetas.filter(r => r.id_usuario === user.id_usuario)
    : recetas*/}

  const handleSearch = (results, searchQuery) => {
    setRecetas(results);
    setQuery(searchQuery);
  };

  return (
    <>
      <Header onLogin={setUser} />
      <Searcher onSearch={handleSearch}  />
      <SearchResults results={recetas} query={query} featured={featured} />
      <Footer />


    </>
  )
}

export default App