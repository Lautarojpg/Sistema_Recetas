import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const difficultyMap = {
    "Fácil": "facil",
    "Media": "media",
    "Difícil": "dificil"
  };

  const dificultadClass = difficultyMap[recipe.dificultad];

  const MAX_ING_PER_RECIPE = 5;
  const displayedIngredients = recipe.ingredientes?.slice(0, MAX_ING_PER_RECIPE);

  return (
    <li className="recipe-card" onClick={() => navigate(`/receta/${recipe.id_receta}`)}>
      
        <div className="recipe-image-container">
          <img 
            src={recipe.imagen} 
            alt={recipe.nombre_receta} 
            className="recipe-img"
          />

          <div className="overlay"></div>

          <div className="badge-container">
            <span className={`badge ${dificultadClass}`}>
              {recipe.dificultad}
            </span>

            <span className="time-badge">
              {recipe.tiempo_total} min
            </span>
          </div>
        </div>

        <div className="recipe-content">
          <h3>{recipe.nombre_receta}</h3>
          <p>{recipe.descripcion}</p>
          <div className="ingredients-recipe-card">
              {displayedIngredients.map((ing) => (
                <a key={ing.id_ingrediente}>{ing.nombre}</a>
              ))}
          </div>
          <div className="nutrition">
            <span>P {recipe.info_nutricional?.proteinas_totales ?? 0}g</span>
            <span>C {recipe.info_nutricional?.carbs_totales ?? 0}g</span>
            <span>G {recipe.info_nutricional?.grasas_totales ?? 0}g</span>
          </div>

        </div>
    </li>
  );
}

export default RecipeCard;