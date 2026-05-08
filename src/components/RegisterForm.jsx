import { useState } from "react";
import { validarRegistrarUsuario} from "../services/utils.js"
import { registrarUsuario } from "../services/api.js";

export default function RegisterForm({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: ""
  });

  const [errores, setErrores] = useState({});

  // 🔹 Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrores({
      ...errores,
      [e.target.name]: ""
    });
  };

  const presionarRegistrarse = async (e) => {
    e.preventDefault();

    const erroresValidacion = validarRegistrarUsuario(form);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) {
      return;
    }

    try {
      await registrarUsuario(form);

      alert("Usuario creado correctamente");
      onClose();

    } catch (errorData) {
       alert("Error recibido");
       console.log(errorData);
      setErrores(errorData.errors || {});
    }
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.form} onSubmit={presionarRegistrarse}>
        <h3>Registrarse</h3>

        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        {errores.nombre && <span style={styles.error}>{errores.nombre}</span>}

        <input name="apellido" placeholder="Apellido" onChange={handleChange} />
        {errores.apellido && <span style={styles.error}>{errores.apellido}</span>}

        <input name="email" placeholder="Email" onChange={handleChange} />
        {errores.email && <span style={styles.error}>{errores.email}</span>}

        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        {errores.password && <span style={styles.error}>{errores.password}</span>}

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