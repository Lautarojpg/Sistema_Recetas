import { useState } from "react";
import { ingresarUsuario } from "../services/api.js"

export default function LoginForm({ onClose, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const presionarIngresar = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      const user = await ingresarUsuario(form);
      onLogin(user);
      onClose();
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-form-overlay">
      <form className="login-form" onSubmit={presionarIngresar}>
        <h3>Ingresar</h3>

        {error && <p style={{ color: "#e74c3c", fontSize: "14px", margin: "0 0 10px" }}>{error}</p>}

        <input name="email" placeholder="Email" value={form.email} onChange={handleCambio} />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleCambio} />

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}
