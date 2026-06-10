import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`/api/recetas`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(r => r.id_receta === parseInt(id));
        setRecipe(found);
      });
  }, [id]);

  if (!recipe) return <p>Cargando...</p>;

  return (
    <div className="recipe-page">

  <div className="recipe-hero">
    <img
      src={recipe.imagen}
      alt={recipe.nombre_receta}
      className="recipe-hero-img"
    />

    <div className="recipe-hero-info">
      <h1>{recipe.nombre_receta}</h1>

      <p className="recipe-desc">
        {recipe.descripcion}
      </p>

      <div className="recipe-meta">
        <span>⏱ {recipe.tiempo_total} min</span>
        <span>📊 {recipe.dificultad}</span>
        <span>🍽 {recipe.porcion} porciones</span>
      </div>
    </div>
  </div>

  <div className="recipe-body">

    <div className="recipe-section">
      <h2>Ingredientes</h2>
      <ul>
        {recipe.ingredientes.map((ing) => (
          <li key={ing.id_ingrediente}>
            {ing.nombre} - {ing.cantidad} {ing.unidad}
          </li>
        ))}
      </ul>
    </div>

    <div className="recipe-section">
      <h2>Instrucciones</h2>
      <p>{recipe.instrucciones}</p>
    </div>

  </div>

</div>
  );
}