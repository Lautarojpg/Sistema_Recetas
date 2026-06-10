import IngredienteService from '../services/IngredienteService.js';

class IngredienteController {
    constructor() {
        this.ingredienteService = new IngredienteService();
    }

    buscarTodosIngredientes = async (req, res) => {
        try {
            const ingredientes = await this.ingredienteService.obtenerTodos();
            return res.json(ingredientes);
        } catch (error) {
            console.error("Error al buscar ingredientes:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    crearIngrediente = async (req, res) => {
        try {
            // Verificación de administrador
            if (!req.usuario || req.usuario.email !== 'admin@admin.com') {
                return res.status(403).json({ error: "Acceso denegado. Solo administradores pueden crear ingredientes." });
            }

            const datosIngrediente = req.body;
            await this.ingredienteService.crearIngrediente(datosIngrediente);
            return res.status(201).json({ message: "Ingrediente creado con éxito" });
        } catch (error) {
            console.error("Error al crear ingrediente:", error);
            if (error.message.includes('obligatorio') || error.message.includes('deben ser')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno al crear ingrediente' });
        }
    }
}

export default IngredienteController;
