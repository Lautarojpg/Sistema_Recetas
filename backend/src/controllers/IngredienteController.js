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

    crear = async (req, res) => {
        try {
            const datosIngrediente = req.body;
            await this.ingredienteService.crearIngrediente(datosIngrediente);
            return res.status(201).json({ message: "Ingrediente creado con éxito" });
        } catch (error) {
            console.error("Error al crear ingrediente:", error);
            return res.status(400).json({ error: error.message });
        }
    }
}

export default IngredienteController;
