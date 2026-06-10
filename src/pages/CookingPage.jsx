import { useEffect, useState } from "react";
import "./CookingPage.css";
import { crearIngrediente, buscarIngredientes, buscarTodasRecetas } from "../services/api.js";
import RecipeCard from "../components/RecipeCard";

export default function CookingPage({ user }) {
    const [ingredientes, setIngredientes] = useState([]);
    const [olla, setOlla] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [haBuscado, setHaBuscado] = useState(false);
    const [loading, setLoading] = useState(true);

    const [filtros, setFiltros] = useState({
        dificultad: "",
        tiempoMax: "",
        proteinasMax: "",
        carbsMax: "",
        grasasMax: ""
    });

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

    // Re-filtrar automáticamente cuando el usuario cambia los filtros avanzados y ya realizó una búsqueda
    useEffect(() => {
        if (haBuscado) {
            buscarRecetas();
        }
    }, [filtros]);

    const manejarCrearIngrediente = async (e) => {
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
            const ingredientesData = await buscarIngredientes();
            setIngredientes(ingredientesData);
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
        setHaBuscado(false);
    };

    const buscarRecetas = async () => {
        if (olla.length === 0) {
            setResultados([]);
            setHaBuscado(false);
            return;
        }
        
        try {
            // Obtenemos todas las recetas (este endpoint sí está activo y no falla)
            const todas = await buscarTodasRecetas();
            
            // 1. Filtrar por ingredientes de la olla (TODOS los de la olla deben estar en la receta)
            const idsOlla = olla.map(i => Number(i.id_ingrediente));
            let coincidencias = todas.filter(receta => {
                const ingredientesReceta = receta.ingredientes || [];
                if (ingredientesReceta.length === 0) return false;
                
                const idsReceta = ingredientesReceta.map(i => Number(i.id_ingrediente));
                // La receta DEBE incluir TODOS los ingredientes que el usuario puso en la olla
                return idsOlla.every(id => idsReceta.includes(id));
            }).map(receta => {
                const ingredientesReceta = receta.ingredientes || [];
                const idsReceta = ingredientesReceta.map(i => Number(i.id_ingrediente));
                const encontrados = idsReceta.filter(id => idsOlla.includes(id));
                const porcentaje = Math.round((encontrados.length / idsReceta.length) * 100);
                return { ...receta, porcentaje };
            }).sort((a, b) => b.porcentaje - a.porcentaje);

            // 2. Filtrar localmente por los filtros avanzados
            const normalizeStr = (str) => str ? String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
            const filtroDificultad = normalizeStr(filtros.dificultad);

            coincidencias = coincidencias.filter(receta => {
                if (filtroDificultad && normalizeStr(receta.dificultad) !== filtroDificultad) return false;
                if (filtros.tiempoMax && Number(receta.tiempo_total) > Number(filtros.tiempoMax)) return false;
                if (filtros.proteinasMax && Number(receta.info_nutricional?.proteinas_totales) > Number(filtros.proteinasMax)) return false;
                if (filtros.carbsMax && Number(receta.info_nutricional?.carbs_totales) > Number(filtros.carbsMax)) return false;
                if (filtros.grasasMax && Number(receta.info_nutricional?.grasas_totales) > Number(filtros.grasasMax)) return false;
                return true;
            });

            setResultados(coincidencias);
        } catch (error) {
            console.error("Error al buscar localmente:", error);
            setResultados([]);
        }

        setHaBuscado(true);
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
                        {user && user.email === 'admin@admin.com' && (
                            <button className="add-ingredient-btn" onClick={() => setMostrarFormIngrediente(true)}>
                                + Nuevo
                            </button>
                        )}
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

                    <div className="cooking-filters-container" style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <div className="cooking-filters">
                            <select 
                                value={filtros.dificultad} 
                                onChange={e => setFiltros({...filtros, dificultad: e.target.value})}
                            >
                                <option value="">Todas las dificultades</option>
                                <option value="Fácil">Fácil</option>
                                <option value="Media">Media</option>
                                <option value="Difícil">Difícil</option>
                            </select>
                            <input 
                                type="number" 
                                min="0"
                                placeholder="Tiempo máx (min)" 
                                value={filtros.tiempoMax}
                                onChange={e => setFiltros({...filtros, tiempoMax: e.target.value})}
                            />
                            <input 
                                type="number" 
                                min="0"
                                placeholder="Máx Proteínas (g)" 
                                value={filtros.proteinasMax}
                                onChange={e => setFiltros({...filtros, proteinasMax: e.target.value})}
                            />
                            <input 
                                type="number" 
                                min="0"
                                placeholder="Máx Carbs (g)" 
                                value={filtros.carbsMax}
                                onChange={e => setFiltros({...filtros, carbsMax: e.target.value})}
                            />
                            <input 
                                type="number" 
                                min="0"
                                placeholder="Máx Grasas (g)" 
                                value={filtros.grasasMax}
                                onChange={e => setFiltros({...filtros, grasasMax: e.target.value})}
                            />
                            <button className="clear-filters-btn" onClick={() => setFiltros({dificultad: "", tiempoMax: "", proteinasMax: "", carbsMax: "", grasasMax: ""})}>
                                Limpiar
                            </button>
                        </div>
                    </div>

                    {haBuscado && (
                        <div className="results-panel">
                            <h2>Recetas encontradas</h2>
                            {resultados.length === 0 ? (
                                <p style={{ marginTop: 20, textAlign: 'center', color: '#666' }}>No hay recetas que cumplan con estos filtros y/o ingredientes.</p>
                            ) : (
                                <ul className="results-grid">
                                    {resultados.map((receta) => (
                                        <RecipeCard key={receta.id_receta} recipe={receta} />
                                    ))}
                                </ul>
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
                        
                        <form onSubmit={manejarCrearIngrediente} className="ingredient-form">
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