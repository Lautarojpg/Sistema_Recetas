import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicarReceta, calcularNutricion } from "../services/api.js";
import { validarCamposReceta } from "../services/utils.js";
import { useIngredientes } from "../services/hooks.js";
import { ArrowLeft, ArrowRight, Save, Plus, Trash, Calculator, Check, ChefHat } from "lucide-react";
import "./CreateRecipePage.css";

export default function CreateRecipePage({ user }) {
  const navigate = useNavigate();
  const ingredientesDB = useIngredientes();

  // Redirigir si no hay sesión iniciada
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // No renderizar nada si no hay usuario (evita flash del formulario)
  if (!user) {
    return null;
  }

  const [pasoActual, setPasoActual] = useState(1);
  const [buscarIngrediente, setBuscarIngrediente] = useState("");
  const [erroresFormulario, setErroresFormulario] = useState({});

  const [form, setForm] = useState({
    nombre_receta: "",
    descripcion: "",
    tiempo_total: "",
    dificultad: "Fácil",
    porcion: 1,
    imagen: "",
    instrucciones: [""], // Comienza con un paso de instrucción vacío
    id_usuario: user?.id_usuario || "",
    id_coccion: 1,
    id_etiqueta: 1,
    destacada: false,
    info_nutricional: {
      proteinas_totales: "",
      grasas_totales: "",
      carbs_totales: "",
      aporte_calorico_total: ""
    },
    ingredientes: [] // { id_ingrediente, nombre, cantidad, unidad }
  });

  const handleCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCambioNutricional = (e) => {
    setForm({
      ...form,
      info_nutricional: {
        ...form.info_nutricional,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubirImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048576) { // 1MB en bytes
        alert("La imagen excede el peso máximo permitido de 1MB.");
        e.target.value = ""; // Limpiar input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          imagen: reader.result // Base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Manejo de Instrucciones ---
  const handleCambioInstruccion = (index, valor) => {
    const nuevosPasos = [...form.instrucciones];
    nuevosPasos[index] = valor;
    setForm({ ...form, instrucciones: nuevosPasos });
  };

  const añadirPaso = () => {
    setForm({ ...form, instrucciones: [...form.instrucciones, ""] });
  };

  const eliminarPaso = (index) => {
    if (form.instrucciones.length === 1) return;
    const nuevosPasos = form.instrucciones.filter((_, i) => i !== index);
    setForm({ ...form, instrucciones: nuevosPasos });
  };

  // --- Manejo de Ingredientes Vincular ---
  const toggleSeleccionarIngrediente = (ingDB) => {
    const index = form.ingredientes.findIndex(i => i.id_ingrediente === ingDB.id_ingrediente);
    if (index >= 0) {
      // Remover
      const nuevos = form.ingredientes.filter(i => i.id_ingrediente !== ingDB.id_ingrediente);
      setForm({ ...form, ingredientes: nuevos });
    } else {
      // Agregar
      setForm({
        ...form,
        ingredientes: [...form.ingredientes, {
          id_ingrediente: ingDB.id_ingrediente,
          nombre: ingDB.nombre,
          cantidad: "",
          unidad: "g",
          icono: ingDB.icono
        }]
      });
    }
  };

  const handleCambioCantidadIngrediente = (idIngrediente, cantidad) => {
    const nuevos = form.ingredientes.map(i => {
      if (i.id_ingrediente === idIngrediente) {
        return { ...i, cantidad };
      }
      return i;
    });
    setForm({ ...form, ingredientes: nuevos });
  };

  const handleCambioUnidadIngrediente = (idIngrediente, unidad) => {
    const nuevos = form.ingredientes.map(i => {
      if (i.id_ingrediente === idIngrediente) {
        return { ...i, unidad };
      }
      return i;
    });
    setForm({ ...form, ingredientes: nuevos });
  };

  // --- Auto Calcular Info Nutricional ---
  const autoCalcularNutricion = async (ingredientes) => {
    try {
      const nutricionCalculada = await calcularNutricion(ingredientes);
      setForm({
        ...form,
        info_nutricional: {
          proteinas_totales: nutricionCalculada.proteinas_totales,
          grasas_totales: nutricionCalculada.grasas_totales,
          carbs_totales: nutricionCalculada.carbs_totales,
          aporte_calorico_total: nutricionCalculada.aporte_calorico_total
        }
      });
    } catch (error) {
      alert("Hubo un error al auto-calcular los valores nutricionales desde el servidor.");
    }
  };

  // --- Manejo de Navegacion del Wizard ---
  const avanzarPaso = () => {
    if (pasoActual === 1) {
      if (!form.nombre_receta.trim() || !form.descripcion.trim() || !form.tiempo_total || !form.porcion) {
        alert("Por favor completa todos los campos obligatorios (Nombre, Descripción, Tiempo y Porciones) antes de avanzar.");
        return;
      }
    } else if (pasoActual === 2) {
      if (form.ingredientes.length === 0) {
        alert("Debes agregar al menos un ingrediente a la receta.");
        return;
      }
      const incompletos = form.ingredientes.some(i => !i.cantidad || i.cantidad <= 0);
      if (incompletos) {
        alert("Asegúrate de ingresar una cantidad válida para todos los ingredientes seleccionados.");
        return;
      }
    } else if (pasoActual === 3) {
      const vacios = form.instrucciones.some(inst => !inst || inst.trim() === "");
      if (vacios) {
        alert("Por favor completa todos los pasos de la preparación o elimina los campos vacíos.");
        return;
      }
    }
    
    setPasoActual(pasoActual + 1);
  };

  // --- Guardar Receta ---
  const guardarReceta = async (e) => {
    e.preventDefault();
    setErroresFormulario({});

    // Formatear ingredientes eliminando iconos extras antes de enviar, para encajar en la API
    const ingredientesLimpios = form.ingredientes.map(i => ({
      nombre: i.nombre,
      cantidad: i.cantidad,
      unidad: i.unidad
    }));

    const datosParaValidar = {
      ...form,
      ingredientes: ingredientesLimpios
    };

    // Validación frontend
    const errores = validarCamposReceta(datosParaValidar);
    if (Object.keys(errores).length > 0) {
      setErroresFormulario(errores);
      alert("Hay errores de validación en el formulario. Por favor revisa todos los pasos.");
      // Ir al paso donde esté el error si es posible
      if (errores.nombre_receta || errores.descripcion || errores.tiempo_total || errores.porcion || errores.imagen) {
        setPasoActual(1);
      } else if (errores.ingredientes) {
        setPasoActual(2);
      } else if (errores.instrucciones) {
        setPasoActual(3);
      }
      return;
    }

    try {
      await publicarReceta({
        ...form,
        ingredientes: ingredientesLimpios
      });
      alert("¡Receta creada con éxito y enviada para revisión!");
      navigate("/");
    } catch (err) {
      console.error("Error al guardar:", err);
      if (err.errors) {
        setErroresFormulario(err.errors);
        alert("El servidor rechazó algunos campos. Revisa el formulario.");
      } else if (err.error) {
        alert(err.error); // Para errores como el de token expirado
      } else {
        alert(err.general || err.message || "Error al conectar con el servidor.");
      }
    }
  };

  // Ingredientes filtrados por búsqueda
  const ingredientesFiltrados = ingredientesDB.filter(ing =>
    ing.nombre.toLowerCase().includes(buscarIngrediente.toLowerCase())
  );

  return (
    <div className="create-recipe-container">
      <div className="create-recipe-card glassmorphism">
        
        {/* Header de la Página */}
        <div className="create-recipe-header">
          <ChefHat className="chef-icon" size={40} />
          <div>
            <h2>Crear Nueva Receta</h2>
            <p>Sigue los pasos para publicar tu obra de arte culinaria</p>
          </div>
        </div>

        {/* Indicador de Progreso */}
        <div className="progress-bar-container">
          <div className={`progress-step ${pasoActual >= 1 ? "active" : ""} ${pasoActual > 1 ? "completed" : ""}`} onClick={() => setPasoActual(1)}>
            <div className="step-num">{pasoActual > 1 ? <Check size={16} /> : "1"}</div>
            <span>General</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${pasoActual >= 2 ? "active" : ""} ${pasoActual > 2 ? "completed" : ""}`} onClick={() => setPasoActual(2)}>
            <div className="step-num">{pasoActual > 2 ? <Check size={16} /> : "2"}</div>
            <span>Ingredientes</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${pasoActual >= 3 ? "active" : ""} ${pasoActual > 3 ? "completed" : ""}`} onClick={() => setPasoActual(3)}>
            <div className="step-num">{pasoActual > 3 ? <Check size={16} /> : "3"}</div>
            <span>Instrucciones</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${pasoActual >= 4 ? "active" : ""} ${pasoActual > 4 ? "completed" : ""}`} onClick={() => setPasoActual(4)}>
            <div className="step-num">4</div>
            <span>Nutrición</span>
          </div>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={guardarReceta} className="recipe-wizard-form">
          
          {/* PASO 1: GENERAL */}
          {pasoActual === 1 && (
            <div className="wizard-step-content animation-slide">
              <h3>1. Detalles Generales</h3>
              
              <div className="form-group">
                <label>Nombre de la Receta</label>
                <input
                  type="text"
                  name="nombre_receta"
                  value={form.nombre_receta}
                  onChange={handleCambio}
                  placeholder="Ej. Spaghettis a la Boloñesa"
                  required
                />
                {erroresFormulario.nombre_receta && <span className="error-text">{erroresFormulario.nombre_receta}</span>}
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleCambio}
                  placeholder="Describe brevemente tu receta, sabores, origen, etc. (Mínimo 25 caracteres)"
                  required
                />
                {erroresFormulario.descripcion && <span className="error-text">{erroresFormulario.descripcion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tiempo de Preparación (Minutos)</label>
                  <input
                    type="number"
                    name="tiempo_total"
                    value={form.tiempo_total}
                    onChange={handleCambio}
                    placeholder="Ej. 45"
                    min="1"
                    required
                  />
                  {erroresFormulario.tiempo_total && <span className="error-text">{erroresFormulario.tiempo_total}</span>}
                </div>

                <div className="form-group">
                  <label>Porciones</label>
                  <input
                    type="number"
                    name="porcion"
                    value={form.porcion}
                    onChange={handleCambio}
                    placeholder="Ej. 4"
                    min="1"
                    required
                  />
                  {erroresFormulario.porcion && <span className="error-text">{erroresFormulario.porcion}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dificultad</label>
                  <select name="dificultad" value={form.dificultad} onChange={handleCambio}>
                    <option value="Fácil">Fácil</option>
                    <option value="Media">Media</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Imagen de la Receta</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="imagen-upload"
                      accept="image/*"
                      onChange={handleSubirImagen}
                      className="file-input-hidden"
                    />
                    <label htmlFor="imagen-upload" className="file-upload-btn">
                      Seleccionar Imagen
                    </label>
                    {form.imagen ? (
                       <span className="file-name-success">¡Imagen cargada correctamente!</span>
                    ) : (
                       <span className="file-name-placeholder">Ningún archivo seleccionado</span>
                    )}
                  </div>
                  {erroresFormulario.imagen && <span className="error-text">{erroresFormulario.imagen}</span>}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: INGREDIENTES */}
          {pasoActual === 2 && (
            <div className="wizard-step-content animation-slide">
              <h3>2. Vincular Ingredientes</h3>
              <p className="step-desc">Selecciona los ingredientes que ya están registrados en la base de datos y define sus cantidades.</p>

              {erroresFormulario.ingredientes && <div className="error-badge">{erroresFormulario.ingredientes}</div>}

              <div className="ingredients-selector-layout">
                {/* Panel de Búsqueda y Selección */}
                <div className="selector-search-panel">
                  <input
                    type="text"
                    placeholder="Buscar ingrediente..."
                    value={buscarIngrediente}
                    onChange={(e) => setBuscarIngrediente(e.target.value)}
                    className="search-input"
                  />
                  
                  <div className="selector-grid">
                    {ingredientesFiltrados.map(ing => {
                      const estaSeleccionado = form.ingredientes.some(i => i.id_ingrediente === ing.id_ingrediente);
                      return (
                        <div
                          key={ing.id_ingrediente}
                          className={`selector-card ${estaSeleccionado ? "selected" : ""}`}
                          onClick={() => toggleSeleccionarIngrediente(ing)}
                        >
                          <span className="ing-emoji">{ing.icono}</span>
                          <span className="ing-name">{ing.nombre}</span>
                          {estaSeleccionado && <div className="selected-indicator"><Check size={12} /></div>}
                        </div>
                      );
                    })}
                    {ingredientesFiltrados.length === 0 && (
                      <p className="no-results">No se encontraron ingredientes. Puedes crearlos primero en la página de Cocina.</p>
                    )}
                  </div>
                </div>

                {/* Listado de Ingredientes Seleccionados con Cantidades */}
                <div className="selected-ingredients-panel">
                  <h4>Ingredientes de la Receta ({form.ingredientes.length})</h4>
                  
                  {form.ingredientes.length === 0 ? (
                    <div className="empty-selection">
                      <p>No has seleccionado ningún ingrediente aún.</p>
                      <small>Haz clic en los ingredientes de la izquierda para vincularlos.</small>
                    </div>
                  ) : (
                    <div className="selected-list">
                      {form.ingredientes.map(ing => (
                        <div key={ing.id_ingrediente} className="selected-item-row">
                          <span className="item-icon-name">{ing.icono} {ing.nombre}</span>
                          
                          <div className="item-quantity-inputs">
                            <input
                              type="number"
                              required
                              placeholder="Cant."
                              min="0.1"
                              step="any"
                              value={ing.cantidad}
                              onChange={(e) => handleCambioCantidadIngrediente(ing.id_ingrediente, e.target.value)}
                            />
                            
                            <select
                              value={ing.unidad}
                              onChange={(e) => handleCambioUnidadIngrediente(ing.id_ingrediente, e.target.value)}
                            >
                              <option value="g">g</option>
                              <option value="ml">ml</option>
                              <option value="l">l</option>
                              <option value="unidad">unidad</option>
                              <option value="cucharada">cda.</option>
                            </select>

                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => toggleSeleccionarIngrediente(ing)}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: INSTRUCCIONES */}
          {pasoActual === 3 && (
            <div className="wizard-step-content animation-slide">
              <h3>3. Pasos de Preparación</h3>
              <p className="step-desc">Agrega secuencialmente las instrucciones paso a paso para elaborar la receta.</p>

              {erroresFormulario.instrucciones && <span className="error-text block-error">{erroresFormulario.instrucciones}</span>}

              <div className="instructions-builder-list">
                {form.instrucciones.map((inst, index) => (
                  <div key={index} className="instruction-step-item">
                    <div className="step-number-badge">{index + 1}</div>
                    
                    <textarea
                      value={inst}
                      onChange={(e) => handleCambioInstruccion(index, e.target.value)}
                      placeholder={`Escribe aquí la instrucción para el paso ${index + 1}...`}
                      required
                    />

                    <button
                      type="button"
                      className="delete-step-btn"
                      onClick={() => eliminarPaso(index)}
                      disabled={form.instrucciones.length === 1}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={añadirPaso} className="add-step-btn">
                <Plus size={16} /> Agregar Paso
              </button>
            </div>
          )}

          {/* PASO 4: NUTRICIÓN */}
          {pasoActual === 4 && (
            <div className="wizard-step-content animation-slide">
              <h3>4. Información Nutricional</h3>
              <p className="step-desc">Introduce el aporte nutricional de tu receta. Puedes auto-calcular los valores según los ingredientes vinculados.</p>

              <button
                type="button"
                onClick={() => autoCalcularNutricion(form.ingredientes)}
                className="calculate-btn"
                disabled={form.ingredientes.length === 0}
              >
                <Calculator size={16} /> Auto-calcular desde Ingredientes
              </button>

              <div className="nutritional-grid">
                <div className="form-group">
                  <label>Proteínas Totales (g)</label>
                  <input
                    type="number"
                    name="proteinas_totales"
                    value={form.info_nutricional.proteinas_totales}
                    onChange={handleCambioNutricional}
                    placeholder="Ej. 25"
                    min="0"
                    step="any"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Grasas Totales (g)</label>
                  <input
                    type="number"
                    name="grasas_totales"
                    value={form.info_nutricional.grasas_totales}
                    onChange={handleCambioNutricional}
                    placeholder="Ej. 12"
                    min="0"
                    step="any"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Carbohidratos Totales (g)</label>
                  <input
                    type="number"
                    name="carbs_totales"
                    value={form.info_nutricional.carbs_totales}
                    onChange={handleCambioNutricional}
                    placeholder="Ej. 60"
                    min="0"
                    step="any"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Aporte Calórico Total (kcal)</label>
                  <input
                    type="number"
                    name="aporte_calorico_total"
                    value={form.info_nutricional.aporte_calorico_total}
                    onChange={handleCambioNutricional}
                    placeholder="Ej. 450"
                    min="0"
                    step="any"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones de Navegación del Wizard */}
          <div className="wizard-navigation-actions">
            {pasoActual > 1 ? (
              <button
                type="button"
                className="nav-btn prev-btn"
                onClick={() => setPasoActual(pasoActual - 1)}
              >
                <ArrowLeft size={16} /> Anterior
              </button>
            ) : (
              <button
                type="button"
                className="nav-btn cancel-btn"
                onClick={() => navigate("/")}
              >
                Cancelar
              </button>
            )}

            {pasoActual < 4 ? (
              <button
                type="button"
                className="nav-btn next-btn"
                onClick={avanzarPaso}
              >
                Siguiente <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" className="nav-btn submit-btn save-btn">
                <Save size={16} /> Guardar Receta
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
