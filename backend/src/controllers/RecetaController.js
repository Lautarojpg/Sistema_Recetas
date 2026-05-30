import RecetaService from '../services/RecetaService.js';

class RecetaController {
    constructor() {
        this.recetaService = new RecetaService();
    }

    buscarTodos = async (req, res) => {
        try {
            const queryBusqueda = req.query.q || '';
            const recetas = await this.recetaService.buscarRecetas(queryBusqueda);
            return res.json(recetas);
        } catch (error) {
            console.error("Error al buscar recetas:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    buscarPorUsuario = async (req, res) => {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: "ID de usuario inválido" });
            }
            const recetas = await this.recetaService.buscarRecetasPorUsuario(userId);
            return res.json(recetas);
        } catch (error) {
            console.error("Error al buscar recetas de usuario:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    buscarDestacadas = async (req, res) => {
        try {
            const recetas = await this.recetaService.buscarRecetasDestacadas();
            return res.json(recetas);
        } catch (error) {
            console.error("Error al buscar recetas destacadas:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    crear = async (req, res) => {
        try {
            const datosReceta = req.body;
            const result = await this.recetaService.crearReceta(datosReceta);
            return res.json({
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
}

export default RecetaController;
