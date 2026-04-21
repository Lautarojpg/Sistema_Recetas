function RecipeCard({ recipe }) {
  return (
    <li className="recipe-card">
        <div className="recipe-name">
            <h3>{recipe.nombre}</h3>
            <p>{recipe.descripcion}</p>
        </div>
        <img 
            src={recipe.imagen} 
            alt={recipe.nombre} 
            className="recipe-img"
        />
        <div className="recipe-info">
            
            

            
        </div>
        <button className="recipe-btn">
            Ver
        </button>
    </li>
  );
}

export default RecipeCard;