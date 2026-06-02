import { useEffect, useState } from "react";
import "./CookingPage.css";

export default function CookingPage() {
    const [ingredientes, setIngredientes] = useState([]);
    const [olla, setOlla] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

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
                    <h2>Ingredientes</h2>

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
        </div>
    );
}