import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Searcher from './components/Searcher'
import SearchResults from './components/SearchResults'
import recetas from './recipes.json'

function App() {
  const [user, setUser] = useState(null)
  // 🔥 filtrar recetas según usuario
  const recetasFiltradas = user
    ? recetas.filter(r => r.id_usuario === user.id_usuario)
    : recetas

  return (
    <>
      <Header onLogin={setUser} />

      <Searcher />

      <SearchResults 
        results={[]} 
        query="" 
        featured={recetasFiltradas}
      />

      <Footer />
    </>
  )
}

export default App