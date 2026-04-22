import { ChefHat } from "lucide-react"
import { User2Icon } from "lucide-react"
import UserMenu from "./UserMenu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Header( {onLogin, user, onOpenRecipe}  ) {
  const navigate = useNavigate();
  return (
    <header>
      <nav id = "navbar">
        <div className="logo-box">
          <div className="logo navbar-select" onClick={() => navigate("/")}>
            <ChefHat className="hat-logo" size={32}/>
            <h1>Recetas</h1>
          </div>
        </div>

        <ul className="nav-links">
          <li id="crear-receta-btn">
            <button onClick={onOpenRecipe}>Crear receta</button>
          </li>
        </ul>

        <UserMenu onLogin={onLogin} user={user} />
      </nav>
    </header>
  )
}

export default Header