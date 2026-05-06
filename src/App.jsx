import { useState, useEffect } from 'react'
import { usarSesion } from './services/hooks'
import { Routes, Route } from "react-router-dom";

import Header from './components/Header'
import Footer from './components/Footer'
import RecipeForm from './components/RecipeForm';

import RecipePage from "./pages/RecipePage";
import Home from "./pages/Home";

function App() {
  const { user, setUser } = usarSesion();
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  return (
    <>
      <Header
        onLogin={setUser}
        user={user}
        onOpenRecipe={() => setShowRecipeForm(true)}
      />

      {showRecipeForm && (
        <RecipeForm onClose={() => setShowRecipeForm(false)} />
      )}

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/receta/:id" element={<RecipePage user={user} />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App