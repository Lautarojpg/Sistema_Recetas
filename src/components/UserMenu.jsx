import { useState, useRef, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function UserMenu({ onLogin, user }) {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const menuRef = useRef();

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("session");
    onLogin && onLogin?.(null);
  };

  const handleLogin = (loggedUser) => {
  onLogin?.(loggedUser); 
};

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      
      {/* BOTÓN USUARIO */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >
        {user ? `👤 ${user.nombre}` : "👤"}
      </button>

      {open && (
        <div style={styles.menu}>
          {!user ? (
            <>
              <button
                style={styles.item}
                onClick={() => {
                  setShowLogin(true);
                  setOpen(false);
                }}
              >
                Ingresar
              </button>

              <button
                style={styles.item}
                onClick={() => {
                  setShowRegister(true);
                  setOpen(false);
                }}
              >
                Registrarse
              </button>
            </>
          ) : (
            <>
              <div style={styles.userInfo}>
                Hola, {user.nombre}
              </div>

              <button style={styles.item} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}

      {/* Abre login */}
      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Abre registra*/}
      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
        />
      )}
    </div>
  );
}

const styles = {
  menu: {
    position: "absolute",
    right: 0,
    top: "40px",
    background: "#d69508",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    padding: "10px",
    width: "160px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    zIndex: 1000
  },
  item: {
    padding: "8px",
    border: "none",
    background: "#ea981e",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "left"
  },
  userInfo: {
    fontWeight: "bold",
    padding: "5px 8px"
  }
};