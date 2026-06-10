
import { useSesion } from './services/hooks.js'
import { Routes, Route, useNavigate } from "react-router-dom";

import Header from './components/Header'
import Footer from './components/Footer'

import RecipePage from "./pages/RecipePage";
import Home from "./pages/Home";
import CookingPage from "./pages/CookingPage";
import CreateRecipePage from "./pages/CreateRecipePage";

function App() {
  const { user, setUser } = useSesion();
  const navigate = useNavigate();

  return (
    <>
      <Header
        onLogin={setUser}
        user={user}
        onOpenRecipe={() => navigate("/crear-receta")}
      />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/receta/:id" element={<RecipePage user={user} />} />
        <Route path="/cocina" element={<CookingPage user={user} />} />
        <Route path="/crear-receta" element={<CreateRecipePage user={user} />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App

