import IngredienteService from '../services/IngredienteService.js';

class IngredienteController {
    constructor() {
        this.ingredienteService = new IngredienteService();
    }

    buscarTodos = async (req, res) => {
        try {
            const ingredientes = await this.ingredienteService.obtenerTodos();
            return res.json(ingredientes);
        } catch (error) {
            console.error("Error al buscar ingredientes:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default IngredienteController;
