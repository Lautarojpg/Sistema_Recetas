import Receta from '../models/Receta.js';
import RecetaRepository from '../repositories/RecetaRepository.js';
import IngredienteRepository from '../repositories/IngredienteRepository.js';

class RecetaService {
    constructor() {
        this.recetaRepository = new RecetaRepository();
        this.ingredienteRepository = new IngredienteRepository();
    }

    async crearReceta(datosReceta) {
        const errors = {};

        // 1. Validar campos básicos
        if (!datosReceta.nombre_receta || !datosReceta.nombre_receta.trim()) {
            errors.nombre_receta = "El nombre de la receta es obligatorio";
        }
        if (typeof datosReceta.tiempo_total === 'string') {
            datosReceta.tiempo_total = parseInt(datosReceta.tiempo_total, 10);
        }
        if (isNaN(datosReceta.tiempo_total) || datosReceta.tiempo_total <= 0) {
            errors.tiempo_total = "Tiempo inválido";
        }
        if (typeof datosReceta.porcion === 'string') {
            datosReceta.porcion = parseInt(datosReceta.porcion, 10);
        }
        if (isNaN(datosReceta.porcion) || datosReceta.porcion <= 0) {
            errors.porcion = "Porción inválida";
        }
        if (!datosReceta.id_usuario) {
            errors.usuario = "Usuario inválido";
        }

        // 2. Validar y procesar ingredientes
        const ingredientesProcesados = [];
        if (!Array.isArray(datosReceta.ingredientes) || datosReceta.ingredientes.length === 0) {
            errors.ingredientes = "Debe agregar al menos un ingrediente";
        } else {
            // Obtener todos los ingredientes de la base de datos para mapeo e integridad
            const todosLosIngredientes = await this.ingredienteRepository.buscarTodos();
            
            const nombres = datosReceta.ingredientes.map(i => i.nombre);
            const duplicados = nombres.filter((n, i) => nombres.indexOf(n) !== i && n);
            if (duplicados.length > 0) {
                errors.ingredientes = "Hay ingredientes duplicados";
            } else {
                for (let i = 0; i < datosReceta.ingredientes.length; i++) {
                    const ing = datosReceta.ingredientes[i];
                    
                    if (!ing.nombre) {
                        errors.ingredientes = `Ingrediente inválido en la fila ${i + 1}`;
                        break;
                    }

                    // Buscar por nombre
                    const existe = todosLosIngredientes.find(
                        iDB => iDB.nombre.trim().toLowerCase() === ing.nombre.trim().toLowerCase()
                    );

                    if (!existe) {
                        errors.ingredientes = `Ingrediente inválido: ${ing.nombre}`;
                        break;
                    }

                    const cantidad = Number(ing.cantidad);
                    if (isNaN(cantidad) || cantidad <= 0) {
                        errors.ingredientes = `Cantidad inválida en el ingrediente ${ing.nombre}`;
                        break;
                    }

                    ingredientesProcesados.push({
                        id_ingrediente: existe.id_ingrediente,
                        cantidad: cantidad,
                        unidad: ing.unidad || 'unidad'
                    });
                }
            }
        }

        // Si hay errores de validación, los lanzamos
        if (Object.keys(errors).length > 0) {
            const err = new Error("Errores de validación");
            err.errors = errors;
            throw err;
        }

        // Extraer valores nutricionales enviados por el frontend
        const infoNutricional = datosReceta.info_nutricional || {};
        const proteinas_totales = Number(infoNutricional.proteinas_totales) || 0;
        const grasas_totales = Number(infoNutricional.grasas_totales) || 0;
        const carbs_totales = Number(infoNutricional.carbs_totales) || 0;
        const aporte_calorico_total = Number(infoNutricional.aporte_calorico_total) || 0;

        // Crear la entidad de negocio Receta
        const receta = new Receta(
            null,
            datosReceta.nombre_receta.trim(),
            datosReceta.descripcion ? datosReceta.descripcion.trim() : '',
            datosReceta.porcion,
            datosReceta.imagen || '',
            datosReceta.tiempo_total,
            datosReceta.dificultad || 'Fácil',
            new Date(),
            proteinas_totales,
            grasas_totales,
            carbs_totales,
            aporte_calorico_total,
            datosReceta.id_coccion || 1, // Default coccion
            datosReceta.id_usuario,
            ingredientesProcesados,
            datosReceta.instrucciones || ''
        );

        // Guardar mediante el repositorio
        const id_receta = await this.recetaRepository.crear(receta);
        return { id_receta };
    }

    async buscarRecetas(query = '') {
        return await this.recetaRepository.buscarTodos(query);
    }

    async buscarRecetasPorUsuario(idUsuario) {
        if (!idUsuario) {
            throw new Error("ID de usuario inválido");
        }
        return await this.recetaRepository.buscarPorUsuario(idUsuario);
    }

    async buscarRecetasDestacadas() {
        return await this.recetaRepository.buscarDestacadas();
    }

    async buscarPorId(idReceta) {
        if (!idReceta) {
            throw new Error("ID de receta inválido");
        }
        return await this.recetaRepository.buscarPorId(idReceta);
    }
}

export default RecetaService;
