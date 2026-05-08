import { ChefHat } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="brand-header">
              <ChefHat className="icon"/>
              <span className="brand-name">Recetas</span>
            </div>

            <p className="brand-text">
              Las mejores recetas para cada ocasión, desde desayunos hasta postres. ¡Descubre tu próxima comida favorita con nosotros!
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="footer-title">Explorar</h4>
            <ul className="footer-list">
              {["Recetas populares", "Nuevas recetas", "Por ingrediente", "Por tiempo"].map((item) => (
                <li key={item} className="footer-item">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Categorías</h4>
            <ul className="footer-list">
              {["Desayunos", "Almuerzos", "Cenas", "Postres"].map((item) => (
                <li key={item} className="footer-item">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Compañía</h4>
            <ul className="footer-list">
              {["Sobre nosotros", "Blog", "Contacto", "Privacidad"].map((item) => (
                <li key={item} className="footer-item">{item}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2026 Recetas. Todos los derechos reservados.</p>

          <div className="footer-socials">
            {["Instagram", "Twitter", "YouTube"].map((social) => (
              <span key={social} className="footer-social">{social}</span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer