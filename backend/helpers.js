export const validarIngredientesReceta = (r, ingredientesDB) => {
  const errors = {};

// Tipos
if (typeof r.tiempo_total !== "number" || r.tiempo_total <= 0) {
  errors.tiempo_total = "Tiempo inválido";
}

r.ingredientes.forEach((ing, i) => {
  const existe = ingredientesDB.find(iDB => iDB.nombre === ing.nombre);

  if (!existe) {
    errors.ingredientes = `Ingrediente inválido: ${ing.nombre}`;
  }

  if (typeof ing.cantidad !== "number" || ing.cantidad <= 0) {
    errors.ingredientes = `Cantidad inválida en ingrediente ${i}`;
  }
});

  const nombres = r.ingredientes.map(i => i.nombre);
  const duplicados = nombres.filter((n, i) => nombres.indexOf(n) !== i);

  if (duplicados.length > 0) {
    errors.ingredientes = "Hay ingredientes duplicados";
  }

  if (!r.id_usuario) {
    errors.usuario = "Usuario inválido";
  }

}