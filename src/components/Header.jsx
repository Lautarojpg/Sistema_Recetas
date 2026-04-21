import { ChefHat } from "lucide-react"
import { User2Icon } from "lucide-react"
import UserMenu from "./UserMenu";

function Header() {
  return (
    <header>
      <nav id = "navbar">
        <div className="logo-box">
          <div className="logo navbar-select" >
            <ChefHat className="hat-logo" size={32}/>
            <h1>Recetas</h1>
          </div>
        </div>

        <ul className="nav-links">
         {/* Por si hay que añadir elementos al navbar*/}
        </ul>

        <UserMenu />
      </nav>
    </header>
  )
}

export default Header