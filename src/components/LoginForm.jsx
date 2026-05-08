import { useState } from "react";
import { ingresarUsuario } from "../services/api.js"

export default function LoginForm({ onClose, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const presionarIngresar = (e) => {
    e.preventDefault();
    ingresarUsuario({ form, onClose, onLogin });
  };

  return (
    <div className="login-form-overlay">
      <form className="login-form" onSubmit={presionarIngresar}>
        <h3>Ingresar</h3>

        <input name="email" placeholder="Email" onChange={handleCambio} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleCambio} />

        <button type="submit">Ingresar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}


