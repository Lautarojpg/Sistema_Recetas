import RecetaBuilder from '../models/RecetaBuilder.js';
import RecetaRepository from '../repositories/RecetaRepository.js';
import IngredienteRepository from '../repositories/IngredienteRepository.js';

class RecetaService {
    constructor() {
        this.recetaRepository = new RecetaRepository();
        this.ingredienteRepository = new IngredienteRepository();
    }

    async crearReceta({ nombre_receta, descripcion, porcion, imagen, tiempo_total, dificultad, id_coccion, id_usuario, ingredientes, instrucciones, info_nutricional }) {
        const errors = {};

        // 1. Validar campos básicos
        if (!nombre_receta || !nombre_receta.trim()) {
            errors.nombre_receta = "El nombre de la receta es obligatorio";
        }
        if (typeof tiempo_total === 'string') {
            tiempo_total = parseInt(tiempo_total, 10);
        }
        if (isNaN(tiempo_total) || tiempo_total <= 0) {
            errors.tiempo_total = "Tiempo inválido";
        }
        if (typeof porcion === 'string') {
            porcion = parseInt(porcion, 10);
        }
        if (isNaN(porcion) || porcion <= 0) {
            errors.porcion = "Porción inválida";
        }
        if (!id_usuario) {
            errors.usuario = "Usuario inválido";
        }

        // 2. Validar y procesar ingredientes
        const ingredientesProcesados = [];
        if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
            errors.ingredientes = "Debe agregar al menos un ingrediente";
        } else {
            // Obtener todos los ingredientes de la base de datos para mapeo e integridad
            const todosLosIngredientes = await this.ingredienteRepository.buscarTodos();
            
            const nombres = ingredientes.map(i => i.nombre);
            const duplicados = nombres.filter((n, i) => nombres.indexOf(n) !== i && n);
            if (duplicados.length > 0) {
                errors.ingredientes = "Hay ingredientes duplicados";
            } else {
                for (let i = 0; i < ingredientes.length; i++) {
                    const ing = ingredientes[i];
                    
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
        const infoNutricional = info_nutricional || {};
        const proteinas_totales = Number(infoNutricional.proteinas_totales) || 0;
        const grasas_totales = Number(infoNutricional.grasas_totales) || 0;
        const carbs_totales = Number(infoNutricional.carbs_totales) || 0;
        const aporte_calorico_total = Number(infoNutricional.aporte_calorico_total) || 0;

        // Crear la entidad de negocio Receta utilizando RecetaBuilder (Patrón Builder)
        const receta = new RecetaBuilder()
            .setNombre(nombre_receta.trim())
            .setDescripcion(descripcion ? descripcion.trim() : '')
            .setPorcion(porcion)
            .setImagen(imagen || '')
            .setTiempoTotal(tiempo_total)
            .setDificultad(dificultad || 'Fácil')
            .setFechaCreacion(new Date())
            .setNutricion(proteinas_totales, grasas_totales, carbs_totales, aporte_calorico_total)
            .setCoccion(id_coccion || 1)
            .setUsuario(id_usuario)
            .setIngredientes(ingredientesProcesados)
            .setInstrucciones(instrucciones || [])
            .build();

        // Guardar mediante el repositorio
        const id_receta = await this.recetaRepository.crear(receta);
        return { id_receta };
    }

    async buscarRecetas(terminoBusqueda = '') {
        return await this.recetaRepository.buscarTodos(terminoBusqueda);
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

    async filtrarRecetas(ingredientes, filtros) {
        const todas = await this.buscarRecetas('');
        
        let coincidencias = todas;
        
        // 1. Filtrar por ingredientes
        if (ingredientes && ingredientes.length > 0) {
            const idsOlla = ingredientes.map(i => String(i.id_ingrediente));
            coincidencias = todas.filter(receta => {
                const ingredientesReceta = receta.ingredientes || [];
                if (ingredientesReceta.length === 0) return false;
                const idsReceta = ingredientesReceta.map(i => String(i.id_ingrediente));
                return idsOlla.every(id => idsReceta.includes(id));
            }).map(receta => {
                const ingredientesReceta = receta.ingredientes || [];
                const idsReceta = ingredientesReceta.map(i => String(i.id_ingrediente));
                const encontrados = idsReceta.filter(id => idsOlla.includes(id));
                const porcentaje = Math.round((encontrados.length / idsReceta.length) * 100);
                return { ...receta, porcentaje };
            }).sort((a, b) => b.porcentaje - a.porcentaje);
        } else {
            return [];
        }

        // 2. Filtrar por filtros avanzados
        if (filtros) {
            const normalizeStr = (str) => str ? String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
            const filtroDificultad = normalizeStr(filtros.dificultad);

            coincidencias = coincidencias.filter(receta => {
                if (filtroDificultad && normalizeStr(receta.dificultad) !== filtroDificultad) return false;
                if (filtros.tiempoMax && Number(receta.tiempo_total) > Number(filtros.tiempoMax)) return false;
                if (filtros.proteinasMax && Number(receta.info_nutricional?.proteinas_totales) > Number(filtros.proteinasMax)) return false;
                if (filtros.carbsMax && Number(receta.info_nutricional?.carbs_totales) > Number(filtros.carbsMax)) return false;
                if (filtros.grasasMax && Number(receta.info_nutricional?.grasas_totales) > Number(filtros.grasasMax)) return false;
                return true;
            });
        }

        return coincidencias;
    }

    async calcularNutricion(ingredientes) {
        if (!ingredientes || !Array.isArray(ingredientes)) {
            return { proteinas_totales: 0, grasas_totales: 0, carbs_totales: 0, aporte_calorico_total: 0 };
        }
        
        const todosLosIngredientes = await this.ingredienteRepository.buscarTodos();
        let totalCal = 0;
        let totalProt = 0;
        let totalCarbs = 0;
        let totalGrasas = 0;

        ingredientes.forEach(ing => {
            const dbIng = todosLosIngredientes.find(i => i.id_ingrediente === ing.id_ingrediente);
            const cant = Number(ing.cantidad);
            if (dbIng && !isNaN(cant) && cant > 0) {
                let factor = cant / 100;
                if (ing.unidad === "unidad") factor = cant;
                
                totalCal += (dbIng.calorias_por100g || 0) * factor;
                totalProt += (dbIng.proteinas_por100 || 0) * factor;
                totalCarbs += (dbIng.carbs_por100 || 0) * factor;
                totalGrasas += (dbIng.grasas_por100g || 0) * factor;
            }
        });

        return {
            proteinas_totales: Math.round(totalProt * 10) / 10,
            grasas_totales: Math.round(totalGrasas * 10) / 10,
            carbs_totales: Math.round(totalCarbs * 10) / 10,
            aporte_calorico_total: Math.round(totalCal)
        };
    }
}

export default RecetaService;
