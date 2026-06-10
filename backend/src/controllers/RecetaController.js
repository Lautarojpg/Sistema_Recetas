import RecetaService from '../services/RecetaService.js';

class RecetaController {
    constructor() {
        this.recetaService = new RecetaService();
    }

    buscarRecetas = async (req, res) => {
        try {
            const busqueda = req.query.q || '';
            const recetas = await this.recetaService.buscarRecetas(busqueda);
            return res.json(recetas);
        } catch (error) {
            console.error("Error al buscar recetas:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    buscarRecetasPorUsuario = async (peticion, respuesta) => {
        try {
            const idUsuario = parseInt(peticion.params.id, 10);
            if (isNaN(idUsuario)) {
                return respuesta.status(400).json({ error: "ID de usuario inválido" });
            }
            const recetas = await this.recetaService.buscarRecetasPorUsuario(idUsuario);
            return respuesta.json(recetas);
        } catch (error) {
            console.error("Error al buscar recetas de usuario:", error);
            return respuesta.status(500).json({ error: error.message });
        }
    }

    buscarRecetasDestacadas = async (req, res) => {
        try {
            const recetas = await this.recetaService.buscarRecetasDestacadas();
            return res.json(recetas);
        } catch (error) {
            console.error("Error al buscar recetas destacadas:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    crearReceta = async (req, res) => {
        try {
            const datosReceta = req.body;
            datosReceta.id_usuario = req.usuario.id_usuario;
            const result = await this.recetaService.crearReceta(datosReceta);
            return res.status(201).json({
                message: "Receta enviada para revision",
                id_receta: result.id_receta
            });
        } catch (error) {
            console.error("Error al crear receta:", error);
            if (error.errors) {
                return res.status(400).json({ errors: error.errors });
            }
            return res.status(500).json({ general: error.message });
        }
    }

    filtrarRecetas = async (req, res) => {
        try {
            const { ingredientes, filtros } = req.body;
            console.log("Recibido para filtrar:", { ingredientes, filtros });
            
            const coincidencias = await this.recetaService.filtrarRecetas(ingredientes, filtros);
            
            console.log(`Recetas devueltas: ${coincidencias.length}`);
            return res.json(coincidencias);
        } catch (error) {
            console.error("Error al filtrar recetas:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    calcularNutricion = async (req, res) => {
        try {
            const { ingredientes } = req.body;
            const nutricion = await this.recetaService.calcularNutricion(ingredientes);
            return res.json(nutricion);
        } catch (error) {
            console.error("Error al calcular nutricion:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default RecetaController;
