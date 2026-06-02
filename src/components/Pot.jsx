export default function Pot({
    ingredients,
    onDropIngredient,
}) {
    const handleDrop = (e) => {
        e.preventDefault();

        const ingredient =
            e.dataTransfer.getData("ingredient");

        onDropIngredient(ingredient);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className="pot"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <h2>🍲 Olla</h2>

            {ingredients.length === 0 ? (
                <p>Arrastra ingredientes aquí</p>
            ) : (
                <ul>
                    {ingredients.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}