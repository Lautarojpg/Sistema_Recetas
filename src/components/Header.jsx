import { ChefHat } from "lucide-react"
import { User2Icon } from "lucide-react"
import UserMenu from "./UserMenu";
import { useNavigate } from "react-router-dom";

function Header( {onLogin, user}  ) {
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
         {/* Por si hay que añadir elementos al navbar*/}
        </ul>

        <UserMenu onLogin={onLogin} user={user} />
      </nav>
    </header>
  )
}

export default Header