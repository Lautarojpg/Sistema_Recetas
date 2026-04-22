import { useState } from "react";

export default function LoginForm({ onClose, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const user = await res.json();

      localStorage.setItem("session", JSON.stringify(user));

      onLogin(user);
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-form-overlay">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3>Ingresar</h3>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />

        <button type="submit">Ingresar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}


