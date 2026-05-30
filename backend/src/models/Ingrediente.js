class Ingrediente {
    constructor(
        id_ingrediente,
        nombre,
        calorias_por100g,
        proteinas_por100,
        carbs_por100,
        grasas_por100g,
        icono,
        id_coccion
    ) {
        this.id_ingrediente = id_ingrediente;
        this.nombre = nombre;
        this.calorias_por100g = calorias_por100g;
        this.proteinas_por100 = proteinas_por100;
        this.carbs_por100 = carbs_por100;
        this.grasas_por100g = grasas_por100g;
        this.icono = icono;
        this.id_coccion = id_coccion;
    }
}

export default Ingrediente;
