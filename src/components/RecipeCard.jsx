function RecipeCard({ recipe }) {
  return (
    <li className="recipe-card">
      <img 
        src={recipe.imagen} 
        alt={recipe.nombre} 
        className="recipe-img"
      />

      <div className="recipe-info">
        <h4>{recipe.nombre}</h4>
        <p>{recipe.descripcion}</p>

        <button className="recipe-btn">
          Ver receta
        </button>
      </div>
    </li>
  );
}

export default RecipeCard;