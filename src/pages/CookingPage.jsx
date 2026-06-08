import { useEffect, useState } from "react";
import "./CookingPage.css";
import { crearIngrediente } from "../services/api.js";

export default function CookingPage() {
    const [ingredientes, setIngredientes] = useState([]);
    const [olla, setOlla] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para la creación de ingredientes
    const [mostrarFormIngrediente, setMostrarFormIngrediente] = useState(false);
    const [nuevoIngrediente, setNuevoIngrediente] = useState({
        nombre: "",
        calorias_por100g: "",
        proteinas_por100: "",
        carbs_por100: "",
        grasas_por100g: "",
        icono: "🍎"
    });
    const [errorIngrediente, setErrorIngrediente] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleCrearIngrediente = async (e) => {
        e.preventDefault();
        setErrorIngrediente(null);
        try {
            await crearIngrediente(nuevoIngrediente);
            alert("¡Ingrediente creado con éxito!");
            setMostrarFormIngrediente(false);
            setNuevoIngrediente({
                nombre: "",
                calorias_por100g: "",
                proteinas_por100: "",
                carbs_por100: "",
                grasas_por100g: "",
                icono: "🍎"
            });
            // Recargar lista de ingredientes
            cargarDatos();
        } catch (err) {
            console.error(err);
            setErrorIngrediente(err.error || err.message || "Error al crear el ingrediente");
        }
    };

    const cargarDatos = async () => {
        try {
            const [ingredientesRes, recetasRes] = await Promise.all([
                fetch("http://localhost:3000/api/ingredients"),
                fetch("http://localhost:3000/api/recetas"),
            ]);

            const ingredientesData = await ingredientesRes.json();
            const recetasData = await recetasRes.json();

            setIngredientes(ingredientesData);
            setRecetas(recetasData);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const agregarIngrediente = (ingrediente) => {
        const existe = olla.some(
            (i) =>
                i.id_ingrediente ===
                ingrediente.id_ingrediente
        );

        if (!existe) {
            setOlla([...olla, ingrediente]);
        }
    };

    const quitarIngrediente = (idIngrediente) => {
        setOlla(
            olla.filter(
                (i) =>
                    i.id_ingrediente !==
                    idIngrediente
            )
        );
    };

    const vaciarOlla = () => {
        setOlla([]);
        setResultados([]);
    };

    const buscarRecetas = () => {
        if (olla.length === 0) {
            setResultados([]);
            return;
        }

        const idsOlla = olla.map(
            (i) => i.id_ingrediente
        );

        const coincidencias = recetas
            .map((receta) => {
                const idsReceta =
                    receta.ingredientes.map(
                        (i) => i.id_ingrediente
                    );

                const encontrados =
                    idsReceta.filter((id) =>
                        idsOlla.includes(id)
                    );

                const porcentaje =
                    Math.round(
                        (encontrados.length /
                            idsReceta.length) *
                        100
                    );

                return {
                    ...receta,
                    porcentaje,
                };
            })
            .filter(
                (receta) => receta.porcentaje > 0
            )
            .sort(
                (a, b) =>
                    b.porcentaje - a.porcentaje
            );

        setResultados(coincidencias);
    };

    if (loading) {
        return (
            <div className="cooking-container">
                <h2>Cargando cocina...</h2>
            </div>
        );
    }

    return (
        <div className="cooking-container">
            <h1 className="cooking-title">
                🍳 Cocina Inteligente
            </h1>

            <div className="cooking-layout">

                <aside className="ingredients-panel">
                    <div className="ingredients-panel-header">
                        <h2>Ingredientes</h2>
                        <button className="add-ingredient-btn" onClick={() => setMostrarFormIngrediente(true)}>
                            + Nuevo
                        </button>
                    </div>

                    <div className="ingredients-list">
                        {ingredientes.map((ing) => (
                            <div
                                key={
                                    ing.id_ingrediente
                                }
                                className="ingredient-card"
                                onClick={() =>
                                    agregarIngrediente(
                                        ing
                                    )
                                }
                            >
                                <span>
                                    {ing.icono}
                                </span>

                                <span>
                                    {ing.nombre}
                                </span>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="cooking-area">

                    <div className="pot">

                        <div className="pot-icon">
                            🍲
                        </div>

                        <h2>Olla</h2>

                        {olla.length === 0 ? (
                            <p>
                                Selecciona
                                ingredientes
                            </p>
                        ) : (
                            <div className="pot-ingredients">
                                {olla.map((ing) => (
                                    <div
                                        key={
                                            ing.id_ingrediente
                                        }
                                        className="pot-item"
                                        onClick={() =>
                                            quitarIngrediente(
                                                ing.id_ingrediente
                                            )
                                        }
                                    >
                                        {ing.icono}{" "}
                                        {ing.nombre}
                                        ✖
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pot-buttons">
                            <button
                                className="cook-btn"
                                onClick={
                                    buscarRecetas
                                }
                            >
                                Cocinar
                            </button>

                            <button
                                className="clear-btn"
                                onClick={
                                    vaciarOlla
                                }
                            >
                                Vaciar
                            </button>
                        </div>
                    </div>

                    {resultados.length > 0 && (
                        <div className="results-panel">

                            <h2>
                                Recetas
                                encontradas
                            </h2>

                            {resultados.map(
                                (receta) => (
                                    <div
                                        key={
                                            receta.id_receta
                                        }
                                        className="recipe-result"
                                    >
                                        <h3>
                                            {
                                                receta.nombre_receta
                                            }
                                        </h3>

                                        <p>
                                            Compatibilidad:{" "}
                                            <strong>
                                                {
                                                    receta.porcentaje
                                                }
                                                %
                                            </strong>
                                        </p>

                                        <p>
                                            {
                                                receta.descripcion
                                            }
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </main>
            </div>

            {mostrarFormIngrediente && (
                <div className="modal-overlay" onClick={() => setMostrarFormIngrediente(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Crear Nuevo Ingrediente</h3>
                        {errorIngrediente && <div className="error-badge">{errorIngrediente}</div>}
                        
                        <form onSubmit={handleCrearIngrediente} className="ingredient-form">
                            <div className="form-group">
                                <label>Nombre del Ingrediente</label>
                                <input
                                    type="text"
                                    required
                                    value={nuevoIngrediente.nombre}
                                    onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, nombre: e.target.value})}
                                    placeholder="Ej. Tomate Cherry"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Icono / Emoji</label>
                                    <select
                                        value={nuevoIngrediente.icono}
                                        onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, icono: e.target.value})}
                                    >
                                        <option value="🍎">🍎 Manzana</option>
                                        <option value="🥬">🥬 Lechuga</option>
                                        <option value="🍅">🍅 Tomate</option>
                                        <option value="🧅">🧅 Cebolla</option>
                                        <option value="🥔">🥔 Papa</option>
                                        <option value="🥕">🥕 Zanahoria</option>
                                        <option value="🧀">🧀 Queso</option>
                                        <option value="🥩">🥩 Carne</option>
                                        <option value="🍗">🍗 Pollo</option>
                                        <option value="🐟">🐟 Pescado</option>
                                        <option value="🥚">🥚 Huevo</option>
                                        <option value="🥛">🥛 Leche</option>
                                        <option value="🍄">🍄 Hongo</option>
                                        <option value="🧄">🧄 Ajo</option>
                                        <option value="🥑">🥑 Aguacate</option>
                                        <option value="🍋">🍋 Limón</option>
                                        <option value="🌶️">🌶️ Chile</option>
                                        <option value="🧂">🧂 Sal</option>
                                        <option value="🍝">🍝 Pasta</option>
                                        <option value="🍚">🍚 Arroz</option>
                                        <option value="🧈">🧈 Mantequilla</option>
                                        <option value="🍞">🍞 Pan</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Calorías (por 100g)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        min="0"
                                        value={nuevoIngrediente.calorias_por100g}
                                        onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, calorias_por100g: e.target.value})}
                                        placeholder="kcal"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Proteínas (g)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        min="0"
                                        value={nuevoIngrediente.proteinas_por100}
                                        onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, proteinas_por100: e.target.value})}
                                        placeholder="por 100g"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Carbohidratos (g)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        min="0"
                                        value={nuevoIngrediente.carbs_por100}
                                        onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, carbs_por100: e.target.value})}
                                        placeholder="por 100g"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Grasas (g)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        min="0"
                                        value={nuevoIngrediente.grasas_por100g}
                                        onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, grasas_por100g: e.target.value})}
                                        placeholder="por 100g"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-btn">Guardar</button>
                                <button type="button" className="cancel-btn" onClick={() => setMostrarFormIngrediente(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}