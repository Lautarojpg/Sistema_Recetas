import { useState } from "react";

export default function RegisterForm({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
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

    // Obtener usuarios existentes
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Agregar nuevo usuario
    users.push(form);

    // Guardar en "user.json simulado"
    localStorage.setItem("users", JSON.stringify(users));

    alert("Usuario guardado (localStorage)");

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>Registrarse</h3>

        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />

        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000
  },
  form: {
    background: "#b0890a",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px"
  }
};