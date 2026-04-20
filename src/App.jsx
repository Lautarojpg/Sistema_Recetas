import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Searcher from './components/Searcher'
import SearchResults from './components/SearchResults'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Searcher/>
      <SearchResults results={[]} query="" featured={[
        { key: 1, nombre: "Receta Destacada 1" },
        { key: 2, nombre: "Receta Destacada 2" },
        { key: 3, nombre: "Receta Destacada 3" },
      ]} />
      
      <Footer />

    </>
  )
}

export default App
