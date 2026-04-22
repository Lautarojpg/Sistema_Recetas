import { useState } from "react";
import users from "../users.json";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      alert("Credenciales incorrectas");
      return;
    }

    // Guardamos sesión
    localStorage.setItem("session", JSON.stringify(user));

    onLogin(user); // 🔥 importante
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>Ingresar</h3>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  form: {
    background: "#ec9b22",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px"
  }
};