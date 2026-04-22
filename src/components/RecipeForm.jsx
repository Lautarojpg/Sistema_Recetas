import { useState } from "react";

export default function RecipeForm({ onClose }) {
  const [form, setForm] = useState({
    nombre_receta: "",
    descripcion: "",
    tiempo_total: "",
    dificultad: "Fácil",
    porcion: 1,
    imagen: "",
    instrucciones: "",
    id_usuario: 1,
    id_coccion: 1,
    id_etiqueta: 1,
    destacada: false,
    info_nutricional: {
      proteinas_totales: "",
      grasas_totales: "",
      carbs_totales: "",
      aporte_calorico_total: ""
    },
    ingredientes: [
      { nombre: "", cantidad: "", unidad: "" }
    ]
  });
  

  // 🔹 Manejo simple
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Info nutricional (objeto)
  const handleNutricionalChange = (e) => {
    setForm({
      ...form,
      info_nutricional: {
        ...form.info_nutricional,
        [e.target.name]: e.target.value
      }
    });
  };

  // 🔹 Ingredientes (array)
  const handleIngredienteChange = (index, e) => {
    const nuevos = [...form.ingredientes];
    nuevos[index][e.target.name] = e.target.value;

    setForm({
      ...form,
      ingredientes: nuevos
    });
  };

  const addIngrediente = () => {
    setForm({
      ...form,
      ingredientes: [...form.ingredientes, { nombre: "", cantidad: "", unidad: "" }]
    });
  };

  // 🔹 Submit
  const crearReceta = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error en API");

      alert("Receta creada correctamente");
      onClose();

    } catch (err) {
      console.error(err);
      alert("Error al crear receta");
    }
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.form} onSubmit={crearReceta}>
        <h3>Nueva Receta</h3>

        <input name="nombre_receta" placeholder="Nombre" onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />

        <input name="tiempo_total" type="number" placeholder="Tiempo (min)" onChange={handleChange} />
        <input name="porcion" type="number" placeholder="Porciones" onChange={handleChange} />

        <select name="dificultad" onChange={handleChange}>
          <option>Fácil</option>
          <option>Media</option>
          <option>Difícil</option>
        </select>

        <input name="imagen" placeholder="URL imagen" onChange={handleChange} />
        <textarea name="instrucciones" placeholder="Instrucciones" onChange={handleChange} />

        {/* 🔹 Info nutricional */}
        <h4>Info Nutricional</h4>
        <input name="proteinas_totales" placeholder="Proteínas" onChange={handleNutricionalChange} />
        <input name="grasas_totales" placeholder="Grasas" onChange={handleNutricionalChange} />
        <input name="carbs_totales" placeholder="Carbohidratos" onChange={handleNutricionalChange} />
        <input name="aporte_calorico_total" placeholder="Calorías" onChange={handleNutricionalChange} />

        {/* 🔹 Ingredientes */}
        <h4>Ingredientes</h4>
        {form.ingredientes.map((ing, index) => (
          <div key={index}>
            <input
              name="nombre"
              placeholder="Ingrediente"
              onChange={(e) => handleIngredienteChange(index, e)}
            />
            <input
              name="cantidad"
              placeholder="Cantidad"
              onChange={(e) => handleIngredienteChange(index, e)}
            />
            <input
              name="unidad"
              placeholder="Unidad"
              onChange={(e) => handleIngredienteChange(index, e)}
            />
          </div>
        ))}

        <button type="button" onClick={addIngrediente}>
          + Ingrediente
        </button>

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
    width: "400px",
    maxHeight: "90vh",
    overflowY: "auto"
  }
};