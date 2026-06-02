const ingredients = [
    "Tomate",
    "Cebolla",
    "Papa",
    "Pollo",
    "Arroz",
    "Zanahoria",
];

export default function SidebarIngredients() {
    const handleDragStart = (e, ingredient) => {
        e.dataTransfer.setData("ingredient", ingredient);
    };

    return (
        <aside className="sidebar">
            <h2>Ingredientes</h2>

            {ingredients.map((ingredient) => (
                <div
                    key={ingredient}
                    className="ingredient"
                    draggable
                    onDragStart={(e) =>
                        handleDragStart(e, ingredient)
                    }
                >
                    {ingredient}
                </div>
            ))}
        </aside>
    );
}