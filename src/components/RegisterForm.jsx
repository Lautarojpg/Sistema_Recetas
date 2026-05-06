import { useState } from "react";

export default function RegisterForm({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  // Validaciones
  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!form.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    return newErrors;
  };

  //  Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    // opcional: limpiar error al escribir
    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // no envía
    }

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error en API");

      alert("Usuario creado correctamente");
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>Registrarse</h3>

        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        {errors.nombre && <span style={styles.error}>{errors.nombre}</span>}

        <input name="apellido" placeholder="Apellido" onChange={handleChange} />
        {errors.apellido && <span style={styles.error}>{errors.apellido}</span>}

        <input name="email" placeholder="Email" onChange={handleChange} />
        {errors.email && <span style={styles.error}>{errors.email}</span>}

        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        {errors.password && <span style={styles.error}>{errors.password}</span>}

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
    gap: "5px",
    width: "300px"
  },
  error: {
    color: "red",
    fontSize: "12px"
  }
};