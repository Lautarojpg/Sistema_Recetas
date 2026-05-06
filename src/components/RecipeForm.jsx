import { useEffect, useState } from "react";
import { buscarIngredientes } from "../services/api.js";
import { validarCamposReceta } from "../services/utils.js";
import { publicarReceta } from "../services/api.js";


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

  const [ingredients, setIngredients] = useState([]);
  const [erroresFormulario, setErroresFormulario] = useState({
  campos: {},
  datos: {},
  general: null
  });

  // Cargar ingredientes disponibles para el select

  useEffect(() => {
    const cargarIngredientes = async () => {
      const data = await buscarIngredientes();
      setIngredients(data);
    };
    cargarIngredientes();
  }, []);

  //  Manejo simple

  const handleCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  //  Manejo de info nutricional (objeto anidado)

  const handleCambioNutricional = (e) => {
    setForm({
      ...form,
      info_nutricional: {
        ...form.info_nutricional,
        [e.target.name]: e.target.value
      }
    });
  };

  // Manejo de ingredientes (array de objetos)

  const handleCambioIngrediente = (index, e) => {
    const nuevos = [...form.ingredientes];
    nuevos[index][e.target.name] = e.target.value;

    setForm({
      ...form,
      ingredientes: nuevos
    });
  };

  const añadirIngrediente = () => {
    setForm({
      ...form,
      ingredientes: [...form.ingredientes, { nombre: "", cantidad: "", unidad: "" }]
    });
  };

  // Mandar request a backend para guardar receta

  const presionarGuardar = async (e) => {
  e.preventDefault();

  setErroresFormulario({ campos: {}, datos: {}, general: null });

  //  Validación frontend
  const erroresCampos = validarCamposReceta(form);

  if (Object.keys(erroresCampos).length > 0) {
    setErroresFormulario({
      campos: erroresCampos,
      datos: {},
      general: null
    });
    return;
  }

  try {
    const data = await publicarReceta(form);

    if (!data.ok) {
      setErroresFormulario({
        campos: {},
        datos: data.errors,
        general: null
      });
      return;
    }

    alert("Receta enviada para revisión");
    onClose();

  } catch (error) {
    setErroresFormulario({
      campos: {},
      datos: {},
      general: "Error en el servidor"
    });
  }
};

  const mostrarErrores = (campo) => {
  const error =
    erroresFormulario.campos?.[campo] ||
    erroresFormulario.datos?.[campo];

  if (!error) return null;

  return (
    <div className="errores-formulario">
      <p>{error}</p>
    </div>
    );
  };

  return (
    <div className="crear-receta-form-overlay">
      <form className="crear-receta-form" onSubmit={presionarGuardar}>
        <h3>Nueva Receta</h3>

        <input name="nombre_receta" placeholder="Nombre" onChange={handleCambio} />
        {mostrarErrores("nombre_receta")}
        <textarea name="descripcion" placeholder="Descripción" onChange={handleCambio} />
        {mostrarErrores("descripcion")}

        <input name="tiempo_total" type="number" placeholder="Tiempo (min)" onChange={handleCambio} />
        {mostrarErrores("tiempo_total")}

        <input name="porcion" type="number" placeholder="Porciones" onChange={handleCambio} />
        {mostrarErrores("porcion")}

        <select name="dificultad" onChange={handleCambio} required>
          <option>Fácil</option>
          <option>Media</option>
          <option>Difícil</option>
        </select>
        {mostrarErrores("dificultad")}

        <input name="imagen" placeholder="URL imagen" onChange={handleCambio} />
        {mostrarErrores("imagen")}
        <textarea name="instrucciones" placeholder="Instrucciones" onChange={handleCambio} />
        {mostrarErrores("instrucciones")}

        {/* 🔹 Info nutricional */}
        <h4>Info Nutricional</h4>
        <input name="proteinas_totales" type="number" placeholder="Proteínas" onChange={handleCambioNutricional} required/>
        <input name="grasas_totales" type="number" placeholder="Grasas" onChange={handleCambioNutricional} required/>
        <input name="carbs_totales" type="number" placeholder="Carbohidratos" onChange={handleCambioNutricional} required/>
        <input name="aporte_calorico_total" type="number" placeholder="Calorías" onChange={handleCambioNutricional} required/>

        {/* 🔹 Ingredientes */}
        <h4>Ingredientes</h4>
        {form.ingredientes.map((ing, index) => (
          <div key={index}>
            <select name="nombre" value={ing.nombre} onChange={(e) => handleCambioIngrediente(index, e)}>
              <option value="">Seleccionar ingrediente</option>
              {ingredients.map((ingrediente) => (
                <option key={ingrediente.id_ingrediente} value={ingrediente.nombre}>
                  {ingrediente.nombre}
                </option>
              ))}
            </select>
            <input
              name="cantidad"
              placeholder="Cantidad"
              onChange={(e) => handleCambioIngrediente(index, e)}
            />
            <select
              name="unidad"
              value={ing.unidad}
              onChange={(e) => handleCambioIngrediente(index, e)}
            >
              <option value="">Seleccionar</option>
              <option value="g">g</option>
              <option value="l">l</option>
              <option value="unidad">unidad</option>
            </select>
            
          </div>
        ))}

        {mostrarErrores("ingredientes")}

        <button type="button" onClick={añadirIngrediente}>
          + Ingrediente
        </button>

        <button type="submit">
          Guardar
        </button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}