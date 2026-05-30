class Receta {
    constructor(
        id_receta,
        nombre_receta,
        descripcion,
        porcion,
        imagen,
        tiempo_total,
        dificultad,
        fecha_creacion,
        proteinas_totales,
        grasas_totales,
        carbs_totales,
        aporte_calorico_total,
        id_coccion,
        id_usuario,
        ingredientes = [],
        instrucciones = ""
    ) {
        this.id_receta = id_receta;
        this.nombre_receta = nombre_receta;
        this.descripcion = descripcion;
        this.porcion = porcion;
        this.imagen = imagen;
        this.tiempo_total = tiempo_total;
        this.dificultad = dificultad;
        this.fecha_creacion = fecha_creacion;
        this.proteinas_totales = proteinas_totales;
        this.grasas_totales = grasas_totales;
        this.carbs_totales = carbs_totales;
        this.aporte_calorico_total = aporte_calorico_total;
        this.id_coccion = id_coccion;
        this.id_usuario = id_usuario;
        this.ingredientes = ingredientes; // Array de { id_ingrediente, nombre, cantidad, unidad }
        this.instrucciones = instrucciones; // String con las instrucciones / pasos
    }
}

export default Receta;
