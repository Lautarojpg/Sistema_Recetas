import Receta from './Receta.js';

class RecetaBuilder {
    constructor() {
        this.reset();
    }

    reset() {
        this.id_receta = null;
        this.nombre_receta = '';
        this.descripcion = '';
        this.porcion = 1;
        this.imagen = '';
        this.tiempo_total = 0;
        this.dificultad = 'Fácil';
        this.fecha_creacion = new Date();
        this.proteinas_totales = 0;
        this.grasas_totales = 0;
        this.carbs_totales = 0;
        this.aporte_calorico_total = 0;
        this.id_coccion = 1;
        this.id_usuario = null;
        this.ingredientes = [];
        this.instrucciones = [];
        return this;
    }

    setId(id) {
        this.id_receta = id;
        return this;
    }

    setNombre(nombre) {
        this.nombre_receta = nombre;
        return this;
    }

    setDescripcion(descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    setPorcion(porcion) {
        this.porcion = porcion;
        return this;
    }

    setImagen(imagen) {
        this.imagen = imagen;
        return this;
    }

    setTiempoTotal(tiempo) {
        this.tiempo_total = tiempo;
        return this;
    }

    setDificultad(dificultad) {
        this.dificultad = dificultad;
        return this;
    }

    setFechaCreacion(fecha) {
        this.fecha_creacion = fecha;
        return this;
    }

    setNutricion(proteinas, grasas, carbs, calorias) {
        this.proteinas_totales = proteinas;
        this.grasas_totales = grasas;
        this.carbs_totales = carbs;
        this.aporte_calorico_total = calorias;
        return this;
    }

    setCoccion(idCoccion) {
        this.id_coccion = idCoccion;
        return this;
    }

    setUsuario(idUsuario) {
        this.id_usuario = idUsuario;
        return this;
    }

    setIngredientes(ingredientes) {
        this.ingredientes = ingredientes || [];
        return this;
    }

    setInstrucciones(instrucciones) {
        this.instrucciones = instrucciones || [];
        return this;
    }

    build() {
        const receta = new Receta(
            this.id_receta,
            this.nombre_receta,
            this.descripcion,
            this.porcion,
            this.imagen,
            this.tiempo_total,
            this.dificultad,
            this.fecha_creacion,
            this.proteinas_totales,
            this.grasas_totales,
            this.carbs_totales,
            this.aporte_calorico_total,
            this.id_coccion,
            this.id_usuario,
            this.ingredientes,
            this.instrucciones
        );
        return receta;
    }
}

export default RecetaBuilder;
